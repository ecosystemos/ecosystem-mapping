import React, { useContext } from "react";

import { Box } from "@chakra-ui/react";
import { DragDropContext } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Row from "../drap&dropComponent/row/Row";
import ToastComponent from "../../basic/ToastComponent";
import { Service } from "../../../service/service";
import { CanvasProvider } from "../../../pages/MapCanvasPage";

function ContentCanvas(props) {
  const {
    isFilterOpen,
    secondaryData,
    handleServiceClick,
    heights,
    containerHeight,
    isFiltersActive,
  } = props;
  const canvasProvider = useContext(CanvasProvider);
  const [data, setData] = canvasProvider.fetchedData;
  const { t } = useTranslation();

  const height = (isFilterOpen ? 135 : 75) + 12;

  function setOrder(list, servicesId) {
    list.forEach((value) => {
      const index = servicesId.findIndex((service) => service === value.id);
      if (index !== -1) {
        value.order = index;
      }
    });
  }

  async function setOrderAndApplicationType(listIds, services) {
    let error;

    for (const value of Object.values(services)) {
      if (listIds.includes(value.id)) {
        const data = {
          order: value.order,
          applicationType: value.applicationType,
        };

        await Service.updateServiceOrderAndApplicationType(
          value.id,
          data
          // eslint-disable-next-line no-loop-func
        ).catch((e) => (error = e));

        //Stop the loop if we have an error
        if (error) {
          break;
        }
      }
    }

    return error;
  }

  function getToast(res) {
    // Display toast to show to the user that either they were a problem or it was updated.
    if (res) {
      ToastComponent(t("mapping.toast.error"), "error");
    } else {
      ToastComponent(t("mapping.toast.success.services.updated"), "success");
    }
  }

  // Update the new positioning of the services
  async function handleDragEnd(result) {
    const { destination, source, draggableId } = result;

    // The drop was done outside the droppable area. The destination is null, so we need to have no modification.
    if (!destination) {
      return;
    }

    // We drop the object at the same position that it was previously. We need to have no modification.
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Retrieve the initial info the object.
    const start = data.rows[source.droppableId];
    const finish = data.rows[destination.droppableId];

    if (start === finish) {
      const newServiceIds = Array.from(start.serviceIds);
      const newServices = data.services;

      // Remove the element from his initial position.
      newServiceIds.splice(source.index, 1);
      // Add the element at the correct index
      newServiceIds.splice(destination.index, 0, draggableId);

      // Create iterable from the object
      const values = Object.values(newServices);

      // set each order to his correct index
      setOrder(values, newServiceIds);

      // Creation of a new instance of the row with the new serviceIds and the rest of the data.
      const newRow = {
        ...start,
        serviceIds: newServiceIds,
      };

      // Creation of a new instance of the data with the new row and the rest of the data (rowsOrder & service).
      const newData = {
        ...data,
        services: newServices,
        rows: {
          ...data.rows,
          [newRow.id]: newRow,
        },
      };

      setData(newData);

      // Update the database
      const res = await setOrderAndApplicationType(newServiceIds, newServices);

      getToast(res);

      return;
    }

    const newServices = data.services;

    // Moving a service to another row
    const startServiceIds = Array.from(start.serviceIds);
    startServiceIds.splice(source.index, 1);
    const newStart = {
      ...start,
      serviceIds: startServiceIds,
    };

    const finishServiceIds = Array.from(finish.serviceIds);
    finishServiceIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      serviceIds: finishServiceIds,
    };

    // Modification of the application Type field
    newServices[draggableId].applicationType = destination.droppableId;

    // set each order to his correct index for the start row
    setOrder(Object.values(newServices), startServiceIds);

    // set each order to his correct index for the finished row
    setOrder(Object.values(newServices), finishServiceIds);

    const newData = {
      ...data,
      services: newServices,
      rows: {
        ...data.rows,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newData);

    const listIds = startServiceIds.concat(finishServiceIds);

    //Update the database
    const res = await setOrderAndApplicationType(listIds, newData.services);

    getToast(res);
  }

  return (
    <Box
      h={`calc(100% - ${height}px)`}
      w="calc(100% - 200px)"
      position="absolute"
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        {secondaryData.rowsOrder.map((rowId) => {
          const row = secondaryData.rows[rowId];
          const services = row.serviceIds.map(
            (serviceId) => data.services[serviceId]
          );

          return (
            <Row
              key={row.id}
              row={row}
              services={services}
              handleServiceClick={handleServiceClick}
              heights={heights}
              containerHeight={containerHeight}
              isFilterOpen={isFilterOpen}
              isFiltersActive={isFiltersActive}
            />
          );
        })}
      </DragDropContext>
    </Box>
  );
}

ContentCanvas.propTypes = {
  isFiltersActive: PropTypes.bool.isRequired,
  isFilterOpen: PropTypes.bool.isRequired,
  containerHeight: PropTypes.array.isRequired,
  heights: PropTypes.array.isRequired,
  secondaryData: PropTypes.object.isRequired,
  handleServiceClick: PropTypes.func.isRequired,
};

export default ContentCanvas;

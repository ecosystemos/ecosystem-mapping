import React, { useEffect, useState } from "react";

import { TableChart } from "@styled-icons/material-outlined";
import styled from "styled-components";
import { Draft } from "@styled-icons/remix-line";
import { Archive } from "@styled-icons/boxicons-regular";
import { Accordion } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import ButtonComponent from "../../basic/buttons/ButtonComponent";
import AccordionItemComponent from "./AccordionItemComponent";
import {
  blackColor,
  blueColor,
  smallPadding,
  whiteColor,
} from "../../../helper/constant";
import PropTypes from "prop-types";

const SideBarContainer = styled.div`
  position: absolute;
  background-color: ${whiteColor};
  z-index: 100;
  width: 50px;
  // Height depending of the filter bar: 75px for the navbar and 60px for the filter bar when open
  height: ${(props) =>
    props.isFilterOpen ? "calc(100% - 135px)" : "calc(100% - 75px)"};

  &:hover {
    width: 250px
  }
}`;

function SideBar(props) {
  const { t } = useTranslation();
  const {
    archivedData,
    onOpenFormEdition,
    handleServiceClick,
    isFilterOpen,
    draftData,
  } = props;

  const initialAccordionButtons = [
    {
      key: 0,
      title: t("mapping.canvas.side.bar.toggle.service.templates"),
      icon: [
        <TableChart key={0} color={blueColor} />,
        <TableChart key={1} color={blackColor} />,
      ],
      children: [
        <ButtonComponent
          key="Financing"
          buttonText="Financing"
          isPrimary={true}
          onClick={() => {}}
          width="100%"
          padding={`0 ${smallPadding} 0 ${smallPadding}`}
          borderRadius="50"
        />,
        <ButtonComponent
          key="Business Model"
          buttonText="Business Model"
          isPrimary={true}
          onClick={() => {}}
          width="100%"
          padding={`${smallPadding} ${smallPadding} 0 ${smallPadding}`}
          borderRadius="50"
        />,
      ],
    },
    {
      key: 1,
      title: t("mapping.canvas.side.bar.toggle.draft.services"),
      icon: [
        <Draft key={0} color={blueColor} />,
        <Draft key={1} color={blackColor} />,
      ],
      children: [],
    },
    {
      key: 2,
      title: t("mapping.canvas.side.bar.toggle.archived.services"),
      icon: [
        <Archive key={0} color={blueColor} />,
        <Archive key={1} color={blackColor} />,
      ],
      children: [],
    },
  ];
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [accordionButtons] = useState(initialAccordionButtons);

  // Update the draft buttons and archived buttons at every update or creation of a service
  useEffect(() => {
    accordionButtons[2].children = [];
    accordionButtons[1].children = [];

    archivedData.forEach((service) => {
      accordionButtons[2].children.push(
        <ButtonComponent
          key={service.id}
          buttonText={service.serviceName}
          isPrimary={true}
          onClick={() => handleDraftOrArchivedServiceClick(service)}
          width="100%"
          padding={`${smallPadding} ${smallPadding} 0 ${smallPadding}`}
          borderRadius="50"
        />
      );
    });

    draftData.forEach((service) => {
      accordionButtons[1].children.push(
        <ButtonComponent
          key={service.id}
          buttonText={service.serviceName}
          isPrimary={true}
          onClick={() => handleDraftOrArchivedServiceClick(service)}
          width="100%"
          padding={`${smallPadding} ${smallPadding} 0 ${smallPadding}`}
          borderRadius="50"
        />
      );
    });
  });

  function handleClick() {
    //todo
  }

  function handleOnMouseOver() {
    setIsCollapsed(false);
  }

  function handleOnMouseLeave() {
    setIsCollapsed(true);
  }

  function handleDraftOrArchivedServiceClick(service) {
    onOpenFormEdition();
    handleServiceClick(service);
  }

  return (
    <SideBarContainer
      onMouseOver={handleOnMouseOver}
      onMouseLeave={handleOnMouseLeave}
      isFilterOpen={isFilterOpen}
    >
      <Accordion allowToggle>
        {accordionButtons.map((thisAccordionButtons) => (
          <AccordionItemComponent
            key={thisAccordionButtons.key}
            onClick={handleClick}
            isCollapsed={isCollapsed}
            button={thisAccordionButtons}
          />
        ))}
      </Accordion>
    </SideBarContainer>
  );
}

SideBar.propTypes = {
  isFilterOpen: PropTypes.bool.isRequired,
  archivedData: PropTypes.array.isRequired,
  draftData: PropTypes.array.isRequired,
  onOpenFormEdition: PropTypes.func.isRequired,
  handleServiceClick: PropTypes.func.isRequired,
};

export default SideBar;

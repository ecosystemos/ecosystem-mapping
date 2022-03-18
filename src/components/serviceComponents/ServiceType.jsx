import React from "react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import RadioButtonsServiceType from "./RadioButtonsServiceType";
import { useTranslation } from 'react-i18next';

const ServiceType = ({radioValue,val}) => {
  const { t } = useTranslation();
  return (
    <FormControl mt={4}>
      <FormLabel className="frm-lbl" mt="24px" mb="17px">
      {t('startup.popup.service.content.primary.focus')}
      </FormLabel>
      <RadioButtonsServiceType radioValue={(e)=>radioValue(e)} val={val} />
    </FormControl>
  );
};

export { ServiceType };

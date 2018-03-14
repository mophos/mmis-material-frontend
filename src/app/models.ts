export interface ILabeler {
  labelerId?: string;
  labelerName?: string;
  labelerShortCode?: string;
  labelerDescription?: string;
  labelerNin?: string;
  labelerTypeId?: string;
  labelerStatusId?: string;
  labelerDisableDate?: string;
  labelerAddress?: string;
  labelerTambon?: string;
  labelerAmpur?: string;
  labelerProvince?: string;
  labelerZipCode?: string;
  labelerPhone?: string;
  labelerUrl?: string;
  labelerMophId?: string;
  labelerRegisterDate?: string;
}

export interface IOrganization {
  orgLabelerId?: string;
  orgNo?: string;
  orgYearRegister?: string;
  orgYearEstablished?: string;
  orgCountry?: string;
  orgFADNumber?: string;
  orgLatitude?: number;
  orgLongitude?: number;
}

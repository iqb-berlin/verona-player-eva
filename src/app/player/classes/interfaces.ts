export enum PropertyKey {
  TEXT,
  TEXT2,
  MAX_VALUE,
  MIN_VALUE,
  MAX_LENGTH,
  LINES_NUMBER
}

export enum FieldType {
  TEXT,
  HEADER,
  TITLE,
  INPUT_TEXT,
  INPUT_NUMBER,
  HTML,
  HR,
  CHECKBOX,
  MULTIPLE_CHOICE,
  DROP_DOWN,
  REPEAT_CONTROL,
  SCRIPT_ERROR
}

export interface KeyValuePairString {
  [K: string]: string;
}

export interface StartData {
  unitDefinition: string;
  unitState: {
    dataParts: KeyValuePairString
  };
}

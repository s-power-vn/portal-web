export type PropertyType =
  | 'string'
  | 'number'
  | 'datetime'
  | 'boolean'
  | 'employee'
  | 'department';
export type OperatorType = '=' | '<>' | '>' | '<' | '>=' | '<=' | 'in';

export type PropertyVariable = {
  name: string;
  type: PropertyType;
  display: string;
};

export type ExpressionRowData = {
  id: string;
  property: string;
  propertyType: PropertyType | '';
  operator: OperatorType | '';
  value: string | string[] | number | boolean | Date | null;
  fromDate?: Date | null;
  toDate?: Date | null;
};

export interface ExpressionRowErrors {
  [key: string]: string;
}

export type ExpressionEditorProps = {
  objectType: string;
  value?: string;
  onSubmit: (value: string) => void;
  onClose: () => void;
};

export type ExpressionRowProps = {
  row: ExpressionRowData;
  variables: PropertyVariable[];
  onUpdate: (id: string, field: keyof ExpressionRowData, value: any) => void;
  onRemove: (id: string) => void;
  errors?: ExpressionRowErrors;
};

export type ValueInputProps = {
  type: PropertyType;
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  error?: string;
};

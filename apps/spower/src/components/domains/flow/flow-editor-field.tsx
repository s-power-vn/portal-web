import type { AnyObject, ObjectSchema } from 'yup';

import type { FormFieldProps } from '@minhdtb/storeo-theme';
import { FormField } from '@minhdtb/storeo-theme';

import { FlowEditor, FlowEditorProps } from './flow-editor';

export type FlowEditorFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<FlowEditorProps, S>;

export const FlowEditorField = <S extends ObjectSchema<AnyObject>>({
  ...props
}: FlowEditorFieldProps<S>) => {
  return (
    <FormField {...props}>
      <FlowEditor {...props.options} />
    </FormField>
  );
};

import { useQueryClient } from '@tanstack/react-query';

import { FC } from 'react';

import { DialogProps } from '@storeo/core';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  TextField
} from '@storeo/theme';

import {
  CreateProjectSchema,
  ProjectSearch,
  getAllProjectsKey,
  useCreateProject
} from '../../../api';
import { CustomerDropdownField } from '../customer/customer-dropdown-field';

const Content: FC<ProjectNewProps> = ({ setOpen, search }) => {
  const queryClient = useQueryClient();

  const createProject = useCreateProject(async () => {
    setOpen(false);
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getAllProjectsKey(search)
      })
    ]);
  });

  return (
    <DialogContent className="w-96">
      <DialogHeader>
        <DialogTitle>Tạo dự án</DialogTitle>
        <DialogDescription className={'italic'}>
          Tạo dự án mới.
        </DialogDescription>
      </DialogHeader>
      <Form
        schema={CreateProjectSchema}
        onSubmit={values => createProject.mutate(values)}
        defaultValues={{
          name: '',
          bidding: '',
          customer: ''
        }}
        loading={createProject.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <TextField
          schema={CreateProjectSchema}
          name={'name'}
          title={'Tên công trình'}
          options={{}}
        />
        <TextField
          schema={CreateProjectSchema}
          name={'bidding'}
          title={'Tên gói thầu'}
          options={{}}
        />
        <CustomerDropdownField
          schema={CreateProjectSchema}
          name={'customer'}
          title={'Chủ đầu tư'}
          options={{
            placeholder: 'Hãy chọn chủ đầu tư'
          }}
        />
        <DialogFooter className={'mt-4'}>
          <Button type="submit">Chấp nhận</Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  );
};

export type ProjectNewProps = DialogProps & {
  search: ProjectSearch;
};

export const NewProjectDialog: FC<ProjectNewProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Content {...props} />
    </Dialog>
  );
};

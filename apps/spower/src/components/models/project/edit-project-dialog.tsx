import { useQueryClient } from '@tanstack/react-query';

import { FC } from 'react';

import { DialogProps, ProjectResponse } from '@storeo/core';
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
  ProjectSearch,
  UpdateProjectSchema,
  getAllProjectsKey,
  useUpdateProject
} from '../../../api';
import { CustomerDropdownField } from '../customer/customer-dropdown-field';

const Content: FC<EditProjectDialogProps> = ({ setOpen, search, project }) => {
  const queryClient = useQueryClient();

  const updateProjectMutation = useUpdateProject(project.id, async () => {
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
        <DialogTitle>Chỉnh sửa tài liệu</DialogTitle>
        <DialogDescription className={'italic'}>
          Chỉnh sửa thông tin chung của tài liệu thi công.
        </DialogDescription>
      </DialogHeader>
      <Form
        schema={UpdateProjectSchema}
        onSubmit={values => updateProjectMutation.mutate(values)}
        defaultValues={project}
        loading={updateProjectMutation.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <TextField
          schema={UpdateProjectSchema}
          name={'name'}
          title={'Tên công trình'}
          options={{}}
        />
        <TextField
          schema={UpdateProjectSchema}
          name={'bidding'}
          title={'Tên gói thầu'}
          options={{}}
        />
        <CustomerDropdownField
          schema={UpdateProjectSchema}
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

export type EditProjectDialogProps = DialogProps & {
  search: ProjectSearch;
  project: ProjectResponse;
};

export const EditProjectDialog: FC<EditProjectDialogProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Content {...props} />
    </Dialog>
  );
};

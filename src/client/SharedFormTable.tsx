import { createForm } from '@formily/core';
import { useForm } from '@formily/react';
import { uid } from '@formily/shared';
import {
  ActionProps,
  ExtendCollectionsProvider,
  ISchema,
  SchemaComponent,
  useActionContext,
  useAPIClient,
  useCollection,
  useCollectionRecordData,
  useDataBlockRequest,
  useDataBlockResource,
} from '@nocobase/client';
import { App as AntdApp } from 'antd';
import React, { useMemo } from 'react';
import { ConfigureLink } from './ConfigureLink';

const sharedFormsCollection = {
  name: 'sharedForms',
  filterTargetKey: 'slug',
  fields: [
    {
      type: 'string',
      name: 'title',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: 'Title',
        required: true,
        'x-component': 'Input',
      },
    },
    {
      type: 'text',
      name: 'description',
      interface: 'textarea',
      uiSchema: {
        type: 'string',
        title: 'Description',
        'x-component': 'Input.TextArea',
      },
    },
    {
      type: 'string',
      name: 'dataSource',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: 'Data source',
        required: true,
        'x-component': 'Input',
      },
    },
    {
      type: 'string',
      name: 'collection',
      interface: 'collection',
      uiSchema: {
        type: 'string',
        title: 'Collection',
        required: true,
        'x-component': 'CollectionSelect',
      },
    },
    {
      type: 'password',
      name: 'password',
      interface: 'password',
      uiSchema: {
        type: 'string',
        title: 'Password',
        'x-component': 'Password',
      },
    },
  ],
};

const initialSchema = (values) => {
  return {
    type: 'void',
    name: uid(),
    properties: {
      form: {
        type: 'void',
        'x-toolbar': 'BlockSchemaToolbar',
        'x-toolbar-props': {
          draggable: false,
        },
        'x-settings': 'blockSettings:createForm',
        'x-component': 'CardItem',
        'x-decorator': 'FormBlockProvider',
        'x-decorator-props': {
          collection: values.collection,
          dataSource: values.dataSource || 'main',
        },
        'x-use-decorator-props': 'useCreateFormBlockDecoratorProps',
        properties: {
          a69vmspkv8h: {
            type: 'void',
            'x-component': 'FormV2',
            'x-use-component-props': 'useCreateFormBlockProps',
            properties: {
              grid: {
                type: 'void',
                'x-component': 'Grid',
                'x-initializer': 'form:configureFields',
              },
              l9xfwp6cfh1: {
                type: 'void',
                'x-component': 'ActionBar',
                'x-initializer': 'createForm:configureActions',
                'x-component-props': {
                  layout: 'one-column',
                },
              },
            },
          },
        },
      },
      success: {
        type: 'void',
        'x-editable': false,
        'x-toolbar-props': {
          draggable: false,
        },
        'x-settings': 'blockSettings:markdown',
        'x-component': 'Markdown.Void',
        'x-decorator': 'CardItem',
        'x-component-props': {
          content: 'This is a demo text, **supports Markdown syntax**.',
        },
        'x-decorator-props': {
          name: 'markdown',
          engine: 'handlebars',
        },
      },
    },
  };
};

const useSubmitActionProps = () => {
  const { setVisible } = useActionContext();
  const { message } = AntdApp.useApp();
  const form = useForm();
  const resource = useDataBlockResource();
  const { runAsync } = useDataBlockRequest();
  const collection = useCollection();
  const api = useAPIClient();
  return {
    type: 'primary',
    async onClick() {
      await form.submit();
      const values = form.values;
      if (values[collection.filterTargetKey]) {
        await resource.update({
          values,
          filterByTk: values[collection.filterTargetKey],
        });
      } else {
        const slug = uid();
        const schema = initialSchema(values);
        schema['x-uid'] = slug;
        await resource.create({
          values: {
            ...values,
            slug,
          },
        });
        await api.resource('uiSchemas').insert({ values: schema });
      }
      await runAsync();
      message.success('Saved successfully!');
      setVisible(false);
    },
  };
};

const useEditFormProps = () => {
  const recordData = useCollectionRecordData();
  const form = useMemo(
    () =>
      createForm({
        initialValues: recordData,
      }),
    [],
  );

  return {
    form,
  };
};

function useDeleteActionProps(): ActionProps {
  const { message } = AntdApp.useApp();
  const record = useCollectionRecordData();
  const resource = useDataBlockResource();
  const { runAsync } = useDataBlockRequest();
  const collection = useCollection();
  return {
    confirm: {
      title: 'Delete',
      content: 'Are you sure you want to delete it?',
    },
    async onClick() {
      await resource.destroy({
        filterByTk: record[collection.filterTargetKey],
      });
      await runAsync();
      message.success('Deleted!');
    },
  };
}

const schema: ISchema = {
  type: 'void',
  name: uid(),
  'x-component': 'CardItem',
  'x-decorator': 'TableBlockProvider',
  'x-decorator-props': {
    collection: sharedFormsCollection.name,
    action: 'list',
    showIndex: true,
    dragSort: false,
  },
  properties: {
    actions: {
      type: 'void',
      'x-component': 'ActionBar',
      'x-component-props': {
        style: {
          marginBottom: 20,
        },
      },
      properties: {
        add: {
          type: 'void',
          'x-component': 'Action',
          title: 'Add New',
          'x-align': 'right',
          'x-component-props': {
            type: 'primary',
          },
          properties: {
            drawer: {
              type: 'void',
              'x-component': 'Action.Drawer',
              title: 'Add new',
              properties: {
                form: {
                  type: 'void',
                  'x-component': 'FormV2',
                  properties: {
                    title: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                      required: true,
                    },
                    dataSource: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                      default: 'main',
                    },
                    collection: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                      required: true,
                    },
                    description: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                    },
                    password: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                    },
                    footer: {
                      type: 'void',
                      'x-component': 'Action.Drawer.Footer',
                      properties: {
                        submit: {
                          title: 'Submit',
                          'x-component': 'Action',
                          'x-use-component-props': 'useSubmitActionProps',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    table: {
      type: 'array',
      'x-component': 'TableV2',
      'x-use-component-props': 'useTableBlockProps',
      'x-component-props': {
        rowKey: sharedFormsCollection.filterTargetKey,
        rowSelection: {
          type: 'checkbox',
        },
      },
      properties: {
        title: {
          type: 'void',
          title: 'Title',
          'x-component': 'TableV2.Column',
          properties: {
            title: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-pattern': 'readPretty',
            },
          },
        },
        dataSource: {
          type: 'void',
          title: 'Data source',
          'x-component': 'TableV2.Column',
          properties: {
            dataSource: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-pattern': 'readPretty',
            },
          },
        },
        collection: {
          type: 'void',
          title: 'Collection',
          'x-component': 'TableV2.Column',
          properties: {
            collection: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-pattern': 'readPretty',
            },
          },
        },
        description: {
          type: 'void',
          title: 'Description',
          'x-component': 'TableV2.Column',
          properties: {
            description: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-pattern': 'readPretty',
            },
          },
        },
        actions: {
          type: 'void',
          title: 'Actions',
          'x-component': 'TableV2.Column',
          properties: {
            actions: {
              type: 'void',
              'x-component': 'Space',
              'x-component-props': {
                split: '|',
              },
              properties: {
                configure: {
                  type: 'void',
                  title: 'Configure',
                  'x-component': ConfigureLink,
                  // 'x-use-component-props': 'useDeleteActionProps',
                },
                edit: {
                  type: 'void',
                  title: 'Edit',
                  'x-component': 'Action.Link',
                  'x-component-props': {
                    openMode: 'drawer',
                    icon: 'EditOutlined',
                  },
                  properties: {
                    drawer: {
                      type: 'void',
                      title: 'Edit',
                      'x-component': 'Action.Drawer',
                      properties: {
                        form: {
                          type: 'void',
                          'x-component': 'FormV2',
                          'x-use-component-props': 'useEditFormProps',
                          properties: {
                            title: {
                              type: 'string',
                              'x-decorator': 'FormItem',
                              'x-component': 'CollectionField',
                              required: true,
                            },
                            description: {
                              type: 'string',
                              'x-decorator': 'FormItem',
                              'x-component': 'CollectionField',
                              required: true,
                            },
                            footer: {
                              type: 'void',
                              'x-component': 'Action.Drawer.Footer',
                              properties: {
                                submit: {
                                  title: 'Submit',
                                  'x-component': 'Action',
                                  'x-use-component-props': 'useSubmitActionProps',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                delete: {
                  type: 'void',
                  title: 'Delete',
                  'x-component': 'Action.Link',
                  'x-use-component-props': 'useDeleteActionProps',
                },
              },
            },
          },
        },
      },
    },
  },
};

export const SharedFormTable = () => {
  return (
    <ExtendCollectionsProvider collections={[sharedFormsCollection]}>
      <SchemaComponent schema={schema} scope={{ useSubmitActionProps, useEditFormProps, useDeleteActionProps }} />
    </ExtendCollectionsProvider>
  );
};

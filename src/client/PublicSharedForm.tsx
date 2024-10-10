import { SchemaComponent, SchemaComponentContext, useRequest } from '@nocobase/client';
import { Spin } from 'antd';
import React, { useContext } from 'react';
import { useParams } from 'react-router';
import { useCreateActionProps } from './useCreateActionProps';

export function PublicSharedForm() {
  const params = useParams();
  const { data, loading } = useRequest<any>({
    url: `sharedForms:getMeta/${params.name}`,
  });
  const ctx = useContext(SchemaComponentContext);
  if (loading) {
    return <Spin />;
  }
  return (
    <div>
      <SchemaComponentContext.Provider value={{ ...ctx, designable: false }}>
        <SchemaComponent schema={data?.data?.schema} scope={{ useCreateActionProps }} />
      </SchemaComponentContext.Provider>
    </div>
  );
}

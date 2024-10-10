import { RemoteSchemaComponent } from '@nocobase/client';
import { Breadcrumb, Button, Space } from 'antd';
import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useCreateActionProps } from './useCreateActionProps';

export function SharedFormConfigure() {
  const params = useParams();
  return (
    <div>
      <div
        style={{
          margin: '-24px',
          padding: '10px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Breadcrumb
          items={[
            {
              title: <Link to={`/admin/settings/shared-forms`}>Shared forms</Link>,
            },
            {
              title: 'Test',
            },
          ]}
        />
        <Space>
          <Link to={`/shared-forms/${params.name}`}>
            <Button>Preview</Button>
          </Link>
        </Space>
      </div>
      <div style={{ maxWidth: 800, margin: '100px auto' }}>
        <RemoteSchemaComponent uid={params.name} scope={{ useCreateActionProps }} />
      </div>
    </div>
  );
}

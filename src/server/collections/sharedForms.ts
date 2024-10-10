import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'sharedForms',
  filterTargetKey: 'slug',
  fields: [
    {
      type: 'uid',
      name: 'slug',
    },
    {
      type: 'string',
      name: 'title',
    },
    {
      type: 'string',
      name: 'dataSource',
    },
    {
      type: 'string',
      name: 'collection',
    },
    {
      type: 'string',
      name: 'description',
    },
    {
      type: 'password',
      name: 'password',
      hidden: true,
    },
  ],
});

import { UiSchemaRepository } from '@nocobase/plugin-ui-schema-storage';
import { Plugin } from '@nocobase/server';

export class PluginSharedFormsServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.dataSourceManager.afterAddDataSource((dataSource) => {
      dataSource.resourceManager.registerActionHandlers({
        publicSubmit: async (ctx, next) => {
          ctx.body = 'ok';
          await next();
        },
      });
    });
    this.app.resourceManager.registerActionHandlers({
      'sharedForms:getMeta': async (ctx, next) => {
        const { filterByTk } = ctx.action.params;
        const sharedForms = this.db.getRepository('sharedForms');
        const uiSchema = this.db.getRepository<UiSchemaRepository>('uiSchemas');
        const instance = await sharedForms.findOne({
          filter: {
            slug: filterByTk,
          },
        });
        const schema = await uiSchema.getJsonSchema(filterByTk);
        ctx.body = {
          collections: [],
          token: this.app.authManager.jwt.sign({
            // todo
          }),
          schema,
        };
        await next();
      },
    });
    this.app.acl.allow('sharedForms', 'getMeta', 'public');
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginSharedFormsServer;

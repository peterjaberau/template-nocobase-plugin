import { Plugin } from '@nocobase/client';
import { PublicSharedForm } from './PublicSharedForm';
import { SharedFormConfigure } from './SharedFormConfigure';
import { SharedFormTable } from './SharedFormTable';

export class PluginSharedFormsClient extends Plugin {
  async load() {
    this.app.router.add('shared-forms', {
      path: '/shared-forms/:name',
      Component: PublicSharedForm,
    });
    this.app.pluginSettingsManager.add('shared-forms', {
      title: 'Shared forms',
      icon: 'TableOutlined',
      Component: SharedFormTable,
    });
    this.app.pluginSettingsManager.add(`shared-forms/:name`, {
      title: false,
      pluginKey: 'shared-forms',
      isTopLevel: false,
      Component: SharedFormConfigure,
    });
  }
}

export default PluginSharedFormsClient;

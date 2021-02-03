import { FlexPlugin } from 'flex-plugin';

const PLUGIN_NAME = 'TransferReportPlugin';

let transferMode = null;

export default class TransferReportPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {


    flex.Actions.addListener("afterTransferTask", (payload) => {

      const { options: { mode }, task: { taskChannelUniqueName }} = payload;

      if(taskChannelUniqueName === "voice"){

          transferMode = mode;

      }

    });

    flex.Actions.addListener("beforeCompleteTask", (payload) => {

      const { task: { taskChannelUniqueName, attributes } } = payload;

      if(taskChannelUniqueName === "voice"){

        payload.task.setAttributes({ 
          ...attributes,
          conversations: {
            ...attributes.conversations,
            followed_by: transferMode
          }
        })

        transferMode = null;

      }

    });

  }

}

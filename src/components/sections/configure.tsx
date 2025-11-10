import {
  component$,
  noSerialize,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import type { NoSerialize } from '@builder.io/qwik';
import { server$, useLocation, useNavigate } from '@builder.io/qwik-city';

// Components
import ReceiversSection from '~/components/sections/receivers/receivers-section';
import ReceiversSettings from '~/components/sections/receivers/receivers-settings';
import SendersSection from '~/components/sections/senders/senders-section';
import SyncribulletSettings from '~/components/sections/syncribullet/syncribullet-settings';
import SyncribulletTitle from '~/components/titles/syncribullet-title';

// Utils
import { configurableReceivers } from '~/utils/connections/receivers';

import { buildClientReceiversFromUserConfigBuildMinifiedStrings } from '~/utils/config/buildClientReceivers';
import { decryptCompressToUserConfigBuildMinifiedStringsResult } from '~/utils/config/buildReceiversFromUrl';
import {
  buildUserConfigBuildMinifiedStringsFromReceivers,
  encryptCompressFromUserConfigBuildMinifiedStrings,
} from '~/utils/config/buildUrlFromReceivers';
import type { UserConfigBuildMinifiedString } from '~/utils/config/types';
import { exists } from '~/utils/helpers/array';
import type { KnownNoSerialize } from '~/utils/helpers/qwik-types';
// Types
import { Receivers } from '~/utils/receiver/types/receivers';
import type { ReceiverClients } from '~/utils/receiver/types/receivers';
import type { GeneralSettings } from '~/utils/settings/general';

export type ApiClientForm = {
  client_id: string;
};

export type ManifestSettingsForm = {
  catalogs: IManifestSettings['catalogs'];
};

export type ApiClientCodeForm = {
  user_code: string;
};

export interface IManifestSettings {
  catalogs: { id: string; name: string; value: boolean }[];
}

export interface ManifestSettingsInfo {
  catalogs: { id: string; name: string }[];
}

export interface CurrentReceiver {
  id: string;
  settings?: {
    info: ManifestSettingsInfo;
    data: IManifestSettings;
  };
}

export enum ReceiversActionType {
  Sync = 'Sync',
  Settings = 'Settings',
}

export const retrieveConfig = server$(function (url: string) {
  return decryptCompressToUserConfigBuildMinifiedStringsResult(
    url,
    this.env.get('PRIVATE_ENCRYPTION_KEY') ||
      '__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  );
});

export const buildURL = server$(function (
  data:
    | [
        {
          [key in Receivers]?: UserConfigBuildMinifiedString<ReceiverClients>;
        },
        GeneralSettings,
      ]
    | {
        [key in Receivers]?: UserConfigBuildMinifiedString<ReceiverClients>;
      },
  useEncryptionKey: boolean = true,
) {
  return encryptCompressFromUserConfigBuildMinifiedStrings(
    data,
    useEncryptionKey
      ? this.env.get('PRIVATE_ENCRYPTION_KEY') ||
          '__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'
      : '__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  );
});

export interface ConfigureProps {
  config?: string;
}

export default component$<ConfigureProps>(({ config }) => {
  const nav = useNavigate();
  const location = useLocation();

  const receivers = useSignal<{
    [key in Receivers]: NoSerialize<ReceiverClients>;
  }>({
    [Receivers.SIMKL]: undefined,
    [Receivers.ANILIST]: undefined,
    [Receivers.KITSU]: undefined,
    [Receivers.TVTIME]: undefined,
  });

  const currentReceiver = useSignal<Receivers | null>();
  const currentViewType = useSignal<ReceiversActionType | null>();

  const syncriBulletSettings = useSignal<GeneralSettings>({});
  const syncriBulletUrl = useSignal<string | undefined>();
  const useEncryptionKey = useSignal<boolean>(true);

  useVisibleTask$(async () => {
    if (config) {
      const configData = await retrieveConfig(config);
      const configReceivers = Array.isArray(configData.result)
        ? buildClientReceiversFromUserConfigBuildMinifiedStrings(
            configData.result[0],
          )
        : buildClientReceiversFromUserConfigBuildMinifiedStrings(
            configData.result,
          );

      useEncryptionKey.value = !configData.usedBackup;

      if (Array.isArray(configData.result)) {
        syncriBulletSettings.value = configData.result[1];
      }
      receivers.value = {
        [Receivers.SIMKL]: noSerialize(
          configReceivers[Receivers.SIMKL],
        ) as NoSerialize<ReceiverClients>,
        [Receivers.ANILIST]: noSerialize(
          configReceivers[Receivers.ANILIST],
        ) as NoSerialize<ReceiverClients>,
        [Receivers.KITSU]: noSerialize(
          configReceivers[Receivers.KITSU],
        ) as NoSerialize<ReceiverClients>,
        [Receivers.TVTIME]: noSerialize(
          configReceivers[Receivers.TVTIME],
        ) as NoSerialize<ReceiverClients>,
      };
      return;
    }
    const configuredReceivers = configurableReceivers();
    receivers.value = {
      [Receivers.SIMKL]: noSerialize(
        configuredReceivers[Receivers.SIMKL],
      ) as NoSerialize<ReceiverClients>,
      [Receivers.ANILIST]: noSerialize(
        configuredReceivers[Receivers.ANILIST],
      ) as NoSerialize<ReceiverClients>,
      [Receivers.KITSU]: noSerialize(
        configuredReceivers[Receivers.KITSU],
      ) as NoSerialize<ReceiverClients>,
      [Receivers.TVTIME]: noSerialize(
        configuredReceivers[Receivers.TVTIME],
      ) as NoSerialize<ReceiverClients>,
    };

    const settings = localStorage.getItem('syncribullet-settings');
    if (settings) {
      try {
        syncriBulletSettings.value = JSON.parse(settings);
      } catch (e) {
        console.error(e);
      }
    }

    Object.values(receivers.value).forEach((receiver) => {
      receiver?.getUserConfig();
    });
  });

  return (
    <>
      <div class="flex flex-col gap-10 justify-center items-center p-6 w-full min-h-screen">
        <SyncribulletTitle />
        <div class="flex items-center justify-between gap-4 p-6 w-full max-w-2xl rounded-xl bg-surface/30 backdrop-blur-sm border border-outline/10">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <img src="https://torbox.app/favicon.ico" alt="TorBox Logo" class="w-9 h-9 rounded-lg flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <h3 class="text-base font-semibold text-on-surface truncate">
                Supercharge with TorBox
              </h3>
              <p class="text-sm text-on-surface/80">
                Lightning-fast debrid service
              </p>
            </div>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <a
              href="https://torbox.app/?referer=aiostreams"
              target="_blank"
              class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary/90 text-on-primary font-medium text-xs hover:bg-primary transition-colors whitespace-nowrap"
            >
              Purchase
            </a>
            <a
              href="https://ko-fi.com/midnightignite"
              target="_blank"
              class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-surface/40 text-on-surface/70 font-medium text-xs hover:bg-surface/60 transition-colors border border-outline/20 whitespace-nowrap"
            >
              ☕ Ko-fi
            </a>
          </div>
        </div>
        <ReceiversSection
          receivers={receivers.value}
          onClick$={(id, type) => {
            currentViewType.value = type;
            if (id === 'syncribullet-settings') {
              return;
            }
            currentReceiver.value = id;
          }}
        />
        {currentReceiver.value &&
        currentViewType.value === ReceiversActionType.Sync &&
        receivers.value[currentReceiver.value] ? (
          <ReceiversSettings
            currentReceiver={
              receivers.value[
                currentReceiver.value
              ] as KnownNoSerialize<ReceiverClients>
            }
            updateReceiver$={() => {
              receivers.value = {
                ...receivers.value,
              };
            }}
          />
        ) : currentViewType.value === ReceiversActionType.Settings ? (
          <SyncribulletSettings
            currentSyncriBulletSettings={syncriBulletSettings.value}
            updateSyncriBulletSettings$={(value) => {
              syncriBulletSettings.value = value;

              const settings = value;
              Object.entries(settings).forEach(([key]) => {
                if (settings[key as keyof GeneralSettings] === undefined) {
                  delete settings[key as keyof GeneralSettings];
                  return;
                }
              });

              localStorage.setItem(
                'syncribullet-settings',
                JSON.stringify(settings),
              );
            }}
          />
        ) : null}
        {Object.values(receivers.value).filter(
          (item) => item && item.userSettings,
        ).length > 0 && (
          <SendersSection
            url={syncriBulletUrl.value}
            onClick$={async () => {
              const receiverList = Object.values(receivers.value)
                .filter(exists)
                .filter((item) => {
                  return !!(
                    item.getLiveSyncTypes(item.userSettings?.liveSync).length +
                    item.getManifestCatalogItems(
                      item.userSettings?.catalogs?.map((x) => x.id),
                    ).length
                  );
                });

              const urlData =
                buildUserConfigBuildMinifiedStringsFromReceivers(receiverList);

              let hasSettings = false;
              const settings = syncriBulletSettings.value;
              const keys = Object.entries(settings).filter(([key]) => {
                if (settings[key as keyof GeneralSettings] === undefined) {
                  return false;
                }
                return true;
              });

              if (keys.length) {
                hasSettings = true;
              }

              const url = hasSettings
                ? await buildURL([urlData, settings])
                : await buildURL(urlData);

              const link = `stremio://${location.url.host.replace(
                'localhost',
                '127.0.0.1',
              )}${
                location.url.host.endsWith('syncribullet')
                  ? '.baby-beamup.club'
                  : ''
              }/${encodeURIComponent(url)}/manifest.json`;

              console.log(link);
              await nav(link);
              syncriBulletUrl.value = link;
            }}
          />
        )}
      </div>
    </>
  );
});

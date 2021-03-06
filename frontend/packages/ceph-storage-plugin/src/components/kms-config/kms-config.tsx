import * as React from 'react';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';

import * as classNames from 'classnames';
import {
  FormGroup,
  TextInput,
  FormSelect,
  FormSelectOption,
  Button,
  ValidatedOptions,
} from '@patternfly/react-core';
import { global_palette_blue_300 as blueInfoColor } from '@patternfly/react-tokens/dist/js/global_palette_blue_300';
import { PencilAltIcon } from '@patternfly/react-icons';

import { advancedKMSModal } from '../modals/advanced-kms-modal/advanced-kms-modal';
import {
  InternalClusterState,
  InternalClusterAction,
  ActionType,
} from '../ocs-install/internal-mode/reducer';
import { KMSProviders } from '../../constants';
import { KMSConfig } from '../../types';
import { State, Action } from '../ocs-install/attached-devices/create-sc/state';
import { setEncryptionDispatch, parseURL } from './utils';
import { StorageClassState, StorageClassClusterAction } from '../../utils/storage-pool';

import './kms-config.scss';

export const KMSConfigure: React.FC<KMSConfigureProps> = ({ state, dispatch, mode, className }) => {
  const { t } = useTranslation();
  const { kms } = state;
  const [kmsProvider, setKMSProvider] = React.useState<string>(KMSProviders[0].name);

  const setServiceName = (name: string) => {
    const kmsObj: KMSConfig = _.cloneDeep(kms);
    kmsObj.name.value = name;
    name !== '' ? (kms.name.valid = true) : (kms.name.valid = false);
    kmsObj.hasHandled = kms.name.valid;
    setEncryptionDispatch(ActionType.SET_KMS_ENCRYPTION, mode, dispatch, kmsObj);
  };

  const setAddress = (address: string) => {
    const kmsObj: KMSConfig = _.cloneDeep(kms);
    kmsObj.address.value = address;
    address !== '' && parseURL(address.trim())
      ? (kms.address.valid = true)
      : (kms.address.valid = false);
    kmsObj.hasHandled = kms.address.valid;
    setEncryptionDispatch(ActionType.SET_KMS_ENCRYPTION, mode, dispatch, kmsObj);
  };

  const setAddressPort = (port: string) => {
    const kmsObj: KMSConfig = _.cloneDeep(kms);
    kmsObj.port.value = port;
    port !== '' && !_.isNaN(Number(port)) && Number(port) > 0
      ? (kms.port.valid = true)
      : (kms.port.valid = false);
    kmsObj.hasHandled = kms.port.valid;
    setEncryptionDispatch(ActionType.SET_KMS_ENCRYPTION, mode, dispatch, kmsObj);
  };

  const setToken = (token: string) => {
    const kmsObj: KMSConfig = _.cloneDeep(kms);
    kmsObj.token.value = token;
    token !== '' ? (kms.token.valid = true) : (kms.token.valid = false);
    kmsObj.hasHandled = kms.token.valid;
    setEncryptionDispatch(ActionType.SET_KMS_ENCRYPTION, mode, dispatch, kmsObj);
  };

  const validateAddressMessage = () =>
    kms.address.value === ''
      ? t('ceph-storage-plugin~This is a required field')
      : t('ceph-storage-plugin~Please enter a URL');

  const validatePortMessage = () =>
    kms.port.value === ''
      ? t('ceph-storage-plugin~This is a required field')
      : t('ceph-storage-plugin~Please enter a valid port');

  const openAdvancedModal = () =>
    advancedKMSModal({
      state,
      dispatch,
      mode,
    });

  const isValid = (value: boolean) => (value ? ValidatedOptions.default : ValidatedOptions.error);

  return (
    <div className="co-m-pane__form">
      {!mode && <h3 className="ocs-install-kms__heading">Connect to a Key Management Service</h3>}
      <FormGroup
        fieldId="kms-provider"
        label={t('ceph-storage-plugin~Key Management Service Provider')}
        className={`${className}__form-body`}
      >
        <FormSelect
          value={kmsProvider}
          onChange={setKMSProvider}
          id="kms-provider"
          name="kms-provider-name"
          aria-label={t('ceph-storage-plugin~kms-provider-name')}
          isDisabled
        >
          {KMSProviders.map((provider) => (
            <FormSelectOption value={provider.value} label={provider.name} />
          ))}
        </FormSelect>
      </FormGroup>
      <FormGroup
        fieldId="kms-service-name"
        label={t('ceph-storage-plugin~Service Name')}
        className={`${className}__form-body`}
        helperTextInvalid="This is a required field"
        validated={isValid(kms.name.valid)}
        isRequired
      >
        <TextInput
          value={kms.name.value}
          onChange={setServiceName}
          type="text"
          id="kms-service-name"
          name="kms-service-name"
          isRequired
          validated={isValid(kms.name.valid)}
        />
      </FormGroup>
      <div className="ocs-install-kms__form-url">
        <FormGroup
          fieldId="kms-address"
          label={t('ceph-storage-plugin~Address')}
          className={classNames('ocs-install-kms__form-address', `${className}__form-body`)}
          helperTextInvalid={validateAddressMessage()}
          validated={isValid(kms.address.valid)}
          isRequired
        >
          <TextInput
            value={kms.address.value}
            onChange={setAddress}
            className="ocs-install-kms__form-address--padding"
            type="url"
            id="kms-address"
            name="kms-address"
            isRequired
            validated={isValid(kms.address.valid)}
          />
        </FormGroup>
        <FormGroup
          fieldId="kms-address-port"
          label={t('ceph-storage-plugin~Port')}
          className={classNames(
            'ocs-install-kms__form-port',
            `${className}__form-body--small-padding`,
          )}
          helperTextInvalid={validatePortMessage()}
          validated={isValid(kms.port.valid)}
          isRequired
        >
          <TextInput
            value={kms.port.value}
            onChange={setAddressPort}
            type="text"
            id="kms-address-port"
            name="kms-address-port"
            isRequired
            validated={isValid(kms.port.valid)}
          />
        </FormGroup>
      </div>
      {mode && (
        <FormGroup
          fieldId="kms-token"
          label={t('ceph-storage-plugin~Token')}
          className={`${className}__form-body`}
          helperTextInvalid={t('ceph-storage-plugin~This is a required field')}
          validated={isValid(kms.token.valid)}
          isRequired
        >
          <TextInput
            value={kms.token.value}
            onChange={setToken}
            type="password"
            id="kms-token"
            name="kms-token"
            isRequired
            validated={isValid(kms.token.valid)}
          />
        </FormGroup>
      )}
      <Button variant="link" className={`${className}__form-body`} onClick={openAdvancedModal}>
        {t('ceph-storage-plugin~Advanced Settings')}{' '}
        {(kms.backend ||
          kms.caCert ||
          kms.tls ||
          kms.clientCert ||
          kms.clientKey ||
          kms.providerNamespace) && (
          <PencilAltIcon data-test="edit-icon" size="sm" color={blueInfoColor.value} />
        )}
      </Button>
    </div>
  );
};

type KMSConfigureProps = {
  state: InternalClusterState | State | StorageClassState;
  dispatch: React.Dispatch<Action | InternalClusterAction | StorageClassClusterAction>;
  mode?: string;
  className: string;
};

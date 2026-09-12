const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'tech-senior-service',
  location: 'southamerica-east1'
};
exports.connectorConfig = connectorConfig;

const cadastrarUsuarioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CadastrarUsuario', inputVars);
}
cadastrarUsuarioRef.operationName = 'CadastrarUsuario';
exports.cadastrarUsuarioRef = cadastrarUsuarioRef;

exports.cadastrarUsuario = function cadastrarUsuario(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(cadastrarUsuarioRef(dcInstance, inputVars));
}
;

const meuPerfilRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'MeuPerfil');
}
meuPerfilRef.operationName = 'MeuPerfil';
exports.meuPerfilRef = meuPerfilRef;

exports.meuPerfil = function meuPerfil(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(meuPerfilRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const excluirUsuarioPorEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ExcluirUsuarioPorEmail', inputVars);
}
excluirUsuarioPorEmailRef.operationName = 'ExcluirUsuarioPorEmail';
exports.excluirUsuarioPorEmailRef = excluirUsuarioPorEmailRef;

exports.excluirUsuarioPorEmail = function excluirUsuarioPorEmail(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(excluirUsuarioPorEmailRef(dcInstance, inputVars));
}
;

const atualizarNomeUsuarioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AtualizarNomeUsuario', inputVars);
}
atualizarNomeUsuarioRef.operationName = 'AtualizarNomeUsuario';
exports.atualizarNomeUsuarioRef = atualizarNomeUsuarioRef;

exports.atualizarNomeUsuario = function atualizarNomeUsuario(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(atualizarNomeUsuarioRef(dcInstance, inputVars));
}
;

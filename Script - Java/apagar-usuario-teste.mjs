import { initializeApp } from "firebase-admin/app";
import { getDataConnect } from "firebase-admin/data-connect";

initializeApp({
  projectId: "tech-senior"
});

const dataConnect = getDataConnect({
  serviceId: "tech-senior-service",
  location: "southamerica-east1"
});

const email = process.argv[2];

if (!email) {
  console.error(
    "Informe o e-mail. Exemplo:\n" +
    "node scripts/apagar-usuario-teste.mjs teste@gmail.com"
  );

  process.exit(1);
}

const mutation = `
  mutation ExcluirUsuarioPorEmail($email: String!) {
    usuario_deleteMany(
      where: {
        email: { eq: $email }
      }
    )
  }
`;

try {

  console.log(`Excluindo do PostgreSQL: ${email}`);

  const resultado =
    await dataConnect.executeGraphql(
      mutation,
      {
        variables: {
          email
        }
      }
    );

  console.log("Usuário excluído do PostgreSQL.");
  console.log(
    JSON.stringify(resultado, null, 2)
  );

} catch (erro) {

  console.error(
    "Erro ao excluir usuário:"
  );

  console.error(erro);

}
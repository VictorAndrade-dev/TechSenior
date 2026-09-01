# Configuração do Firebase e Firestore

## Objetivo desta etapa

O projeto já possui a configuração de um app web Firebase. Esta etapa usa o Cloud Firestore para salvar o progresso de cada pessoa autenticada em:

```text
usuarios/{uid}/progresso/celular
```

## Configuração no console

1. Acesse o projeto Firebase `tech-senior`.
2. Em **Authentication → Sign-in method**, confirme que **E-mail/senha** está habilitado.
3. Em **Firestore Database**, crie o banco em modo de produção. Escolha uma localização próxima do público antes de confirmar, pois ela não pode ser alterada depois.
4. Em **Rules**, substitua o conteúdo pelas regras de [firestore.rules](../firestore.rules).
5. Publique as regras e faça um teste com uma conta de aluno.

Não publique o site com regras de teste abertas. As regras deste repositório permitem que cada pessoa leia e altere somente o próprio perfil e progresso. O catálogo em `cursos` é apenas de leitura para conteúdo publicado.

## Estrutura atual

```text
usuarios/{uid}
  nome, email, tipo, criadoEm

usuarios/{uid}/progresso/celular
  moduloAtual, modulosConcluidos, percentual, atualizadoEm
```

## Publicação futura por CLI

Quando o Firebase CLI for adicionado ao ambiente, este repositório já está preparado para publicar as regras com:

```powershell
firebase deploy --only firestore:rules
```

Só execute o deploy depois de conferir, no console, que o projeto selecionado é o `tech-senior` correto.

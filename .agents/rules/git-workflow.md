# Git Workflow & Branching Policy — Galeto & Picanha

## 🌳 Fluxo de Branches

O desenvolvimento e implantação no projeto Galeto & Picanha segue o fluxo:

```
develop  ───────►  staging  ───────►  main
(Local / Dev)     (Homologação)      (Produção / Hostinger)
```

| Branch | Papel & Ambiente | Como Atualizar |
|---|---|---|
| `develop` | **Desenvolvimento Ativo (Local)** — onde novas features, correções e melhorias visuais são implementadas e validadas localmente. | Commits de feature e bugfixes diários. |
| `staging` | **Validação & Testes Online** — ambiente pré-produção para conferência pelo cliente ou equipe. | **Apenas via MERGE** vindo de `develop` (`develop -> staging`). |
| `main` | **Produção** — código estável conectado à hospedagem Hostinger e domínio público oficial. | **Apenas via MERGE** vindo de `staging` (ou `develop` se homologação direta). |

---

## 🤖 Regras Estritas para o Assistente IA (Antigravity)

1. **Sempre verificar a branch ativa**:
   - Antes de iniciar modificações ou executar commits, confirme a branch com `git branch` ou `git status`.
   - Se for uma alteração de desenvolvimento que ainda passará por testes, trabalhe em `develop`.

2. **Proibido commit direto não autorizado em `main`**:
   - Commits diretos na `main` são permitidos apenas para hotfixes de emergência ou quando explicitamente instruído pelo usuário para publicação imediata.

3. **Deploy / Sincronização**:
   - Sempre que fizer push para a branch `main`, verifique se o arquivo `package.json` está íntegro para evitar erros no assistente de importação da Hostinger.
   - Mensagens de commit devem seguir o padrão Conventional Commits (ex: `feat:`, `fix:`, `chore:`, `perf:`).

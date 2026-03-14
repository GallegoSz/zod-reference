<div align="center">

# 📋 Zod Reference

**Guia de referência completo para o Zod — em TypeScript, com exemplos práticos.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Zod](https://img.shields.io/badge/Zod-3-1d4ed8?logo=zod)](https://zod.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

</div>

---

## 📌 Sobre

Este repositório contém um único arquivo TypeScript que serve como **referência rápida e consultável** para o [Zod](https://zod.dev) — a biblioteca de validação e parsing de schemas mais usada no ecossistema TypeScript.

A ideia é simples: ao invés de ficar voltando para a documentação oficial toda hora, você tem **um arquivo só**, bem organizado, com exemplos reais e comentados, para consultar direto no editor.

---

## 📂 Conteúdo

O arquivo [`zod-reference.ts`](./zod-reference.ts) está dividido em 20 seções:

| # | Seção | O que cobre |
|---|-------|-------------|
| 1 | **Tipos primitivos** | `string`, `number`, `boolean`, `date`, `any`, `unknown`, `never` |
| 2 | **String** | `email`, `url`, `uuid`, `min`, `max`, `regex`, `trim`, `startsWith`... |
| 3 | **Number** | `positive`, `int`, `min`, `max`, `multipleOf`, `finite`, `safe`... |
| 4 | **Object** | `omit`, `pick`, `partial`, `extend`, `merge`, `strict`, `passthrough` |
| 5 | **Array** | `min`, `max`, `length`, `nonempty` |
| 6 | **Tuple** | Posições fixas, elemento rest variádico |
| 7 | **Union & Discriminated Union** | `z.union`, `z.discriminatedUnion` |
| 8 | **Intersection** | `z.intersection`, `.and()` |
| 9 | **Enum & Literal** | `z.enum`, `z.literal`, `z.nativeEnum` |
| 10 | **Optional, Nullable, Nullish, Default** | Modificadores de presença e valor padrão |
| 11 | **Transform & Preprocess** | `transform`, `coerce`, `preprocess`, `pipe` |
| 12 | **Refine & SuperRefine** | Validações customizadas e múltiplos erros |
| 13 | **Record, Map & Set** | Tipos coleção |
| 14 | **Promise & Function** | Schemas para funções tipadas |
| 15 | **Lazy & Recursivo** | Schemas que referenciam a si mesmos (árvores, menus) |
| 16 | **Parse, SafeParse, Async** | Formas de validar dados e tratar erros |
| 17 | **Mensagens de erro customizadas** | `required_error`, `invalid_type_error`, `setErrorMap` |
| 18 | **Padrões comuns** | Login, paginação, validação de variáveis de ambiente |
| 19 | **Utilitários de tipo** | `z.infer`, `z.input`, `z.output`, função genérica de validação |
| 20 | **Cheatsheet** | Resumo visual de todos os métodos principais |

---

## 🚀 Como usar

Não há instalação ou setup. Basta copiar o arquivo para o seu projeto:

```bash
# Clonando o repositório
git clone https://github.com/seu-usuario/zod-reference.git

# Ou copiando só o arquivo que interessa
curl -O https://raw.githubusercontent.com/seu-usuario/zod-reference/main/zod-reference.ts
```

Garanta que o Zod está instalado no seu projeto:

```bash
npm install zod
```

Depois é só abrir o arquivo no editor e usar como consulta. O arquivo compila sem erros com o Zod instalado.

---

## 💡 Exemplos rápidos

### Validando um objeto

```ts
import { z } from "zod";

const Usuario = z.object({
  nome:  z.string().min(2),
  email: z.string().email(),
  idade: z.number().int().min(0).optional(),
});

type Usuario = z.infer<typeof Usuario>;

const resultado = Usuario.safeParse({ nome: "João", email: "j@exemplo.com" });

if (resultado.success) {
  console.log(resultado.data); // { nome: "João", email: "j@exemplo.com" }
} else {
  console.log(resultado.error.flatten());
}
```

### Coerce para dados de formulários

```ts
const Paginacao = z.object({
  pagina: z.coerce.number().int().min(1).default(1),
  limite: z.coerce.number().int().max(100).default(20),
});

// Funciona mesmo com strings vindas de query params
Paginacao.parse({ pagina: "2", limite: "50" });
// → { pagina: 2, limite: 50 }
```

### Validação customizada com refine

```ts
const Formulario = z
  .object({
    senha:         z.string(),
    confirmaSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmaSenha, {
    message: "Senhas não conferem",
    path: ["confirmaSenha"],
  });
```

### Schema recursivo

```ts
type Categoria = { nome: string; subcategorias: Categoria[] };

const Categoria: z.ZodType<Categoria> = z.lazy(() =>
  z.object({
    nome:          z.string(),
    subcategorias: z.array(Categoria),
  })
);
```

---

## 🔗 Recursos oficiais

- [Documentação oficial do Zod](https://zod.dev)
- [Repositório no GitHub](https://github.com/colinhacks/zod)
- [Zod no npm](https://www.npmjs.com/package/zod)

---

## 📄 Licença

MIT — use como quiser.

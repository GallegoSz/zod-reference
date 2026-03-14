/**
 * ============================================================
 *  ZOD — GUIA DE REFERÊNCIA COMPLETO
 *  Documentação prática para consulta rápida
 *  https://zod.dev
 * ============================================================
 */

import { z } from "zod";

// ============================================================
// 1. TIPOS PRIMITIVOS
// ============================================================

const stringSchema    = z.string();
const numberSchema    = z.number();
const booleanSchema   = z.boolean();
const bigintSchema    = z.bigint();
const dateSchema      = z.date();
const undefinedSchema = z.undefined();
const nullSchema      = z.null();
const anySchema       = z.any();       // sem validação
const unknownSchema   = z.unknown();   // seguro: força checagem antes de usar
const neverSchema     = z.never();     // nunca aceita nenhum valor


// ============================================================
// 2. STRING — VALIDAÇÕES
// ============================================================

const email = z.string().email("Email inválido");
const url   = z.string().url("URL inválida");
const uuid  = z.string().uuid();
const cuid  = z.string().cuid();

const minMax = z
  .string()
  .min(3, "Mínimo de 3 caracteres")
  .max(100, "Máximo de 100 caracteres");

const regex = z.string().regex(/^[a-z]+$/, "Somente letras minúsculas");

const trimmed    = z.string().trim();          // remove espaços das bordas
const lowercase  = z.string().toLowerCase();   // transforma em minúsculo
const uppercase  = z.string().toUpperCase();   // transforma em maiúsculo
const startsWith = z.string().startsWith("BR_");
const endsWith   = z.string().endsWith(".pdf");
const includes   = z.string().includes("@");
const datetime   = z.string().datetime();      // ISO 8601
const ip         = z.string().ip({ version: "v4" }); // ou "v6"


// ============================================================
// 3. NUMBER — VALIDAÇÕES
// ============================================================

const positivo   = z.number().positive();
const negativo   = z.number().negative();
const nonneg     = z.number().nonnegative();   // >= 0
const nonpos     = z.number().nonpositive();   // <= 0
const inteiro    = z.number().int();
const finito     = z.number().finite();
const seguro     = z.number().safe();          // dentro de Number.MAX_SAFE_INTEGER
const entre      = z.number().min(0).max(100);
const multiplo   = z.number().multipleOf(5);


// ============================================================
// 4. OBJECT
// ============================================================

const Usuario = z.object({
  id:     z.string().uuid(),
  nome:   z.string().min(2),
  email:  z.string().email(),
  idade:  z.number().int().min(0).optional(),
  admin:  z.boolean().default(false),
});

// Inferindo o tipo TypeScript automaticamente
type Usuario = z.infer<typeof Usuario>;

// Métodos úteis em objetos
const semEmail  = Usuario.omit({ email: true });         // remove campos
const soNome    = Usuario.pick({ nome: true, id: true }); // mantém apenas esses
const parcial   = Usuario.partial();                      // todos opcionais
const obrigatorio = parcial.required();                   // todos obrigatórios novamente

// Estendendo um schema de objeto
const UsuarioComSenha = Usuario.extend({
  senha: z.string().min(8),
});

// merge — combina dois objetos (igual a extend, mas aceita outro z.object)
const Base    = z.object({ id: z.string() });
const Detalhes = z.object({ bio: z.string() });
const Perfil  = Base.merge(Detalhes);

// passthrough — permite campos extras (por padrão o Zod os remove)
const Flexivel = Usuario.passthrough();

// strict — lança erro se houver campos extras
const Rigido = Usuario.strict();

// strip (padrão) — remove campos extras silenciosamente
const Limpo = Usuario.strip();

// keyof — retorna um enum das chaves
const chaves = Usuario.keyof(); // z.enum(["id", "nome", "email", ...])


// ============================================================
// 5. ARRAY
// ============================================================

const lista    = z.array(z.string());
const numeros  = z.number().array();     // forma alternativa

const listMin  = z.array(z.string()).min(1, "Precisa de ao menos 1 item");
const listMax  = z.array(z.string()).max(10);
const listExat = z.array(z.string()).length(3); // exatamente 3
const nonempty = z.array(z.string()).nonempty(); // ao menos 1 item


// ============================================================
// 6. TUPLE
// ============================================================

// Array com posições e tipos fixos
const coordenada = z.tuple([z.number(), z.number()]);
const entrada    = z.tuple([z.string(), z.number(), z.boolean()]);

// Com elemento rest (variádico)
const logEntry = z.tuple([z.string()]).rest(z.number());
// → [string, ...number[]]


// ============================================================
// 7. UNION & DISCRIMINATED UNION
// ============================================================

// Union simples — aceita um dentre vários tipos
const stringOuNumero = z.union([z.string(), z.number()]);
const stringOuNumero2 = z.string().or(z.number()); // forma alternativa

// Discriminated Union — mais eficiente quando há um campo discriminador
const Evento = z.discriminatedUnion("tipo", [
  z.object({ tipo: z.literal("click"),    x: z.number(), y: z.number() }),
  z.object({ tipo: z.literal("keypress"), tecla: z.string() }),
  z.object({ tipo: z.literal("scroll"),   delta: z.number() }),
]);

type Evento = z.infer<typeof Evento>;


// ============================================================
// 8. INTERSECTION
// ============================================================

const ComTimestamp = z.object({ criadoEm: z.date() });
const UsuarioCompleto = Usuario.and(ComTimestamp);
// equivalente a: z.intersection(Usuario, ComTimestamp)


// ============================================================
// 9. ENUM & LITERAL
// ============================================================

// Literal — exatamente um valor
const sim   = z.literal("sim");
const um    = z.literal(1);
const verdadeiro = z.literal(true);

// Enum nativo do Zod
const Cor = z.enum(["vermelho", "verde", "azul"]);
type Cor  = z.infer<typeof Cor>; // "vermelho" | "verde" | "azul"

const valores = Cor.options; // ["vermelho", "verde", "azul"]
const exceto  = Cor.exclude(["azul"]);
const apenas  = Cor.extract(["vermelho", "verde"]);

// Usando enum do TypeScript
enum DirecaoTS { Cima = "UP", Baixo = "DOWN" }
const DirecaoZod = z.nativeEnum(DirecaoTS);


// ============================================================
// 10. OPTIONAL, NULLABLE, NULLISH, DEFAULT
// ============================================================

const opcional      = z.string().optional();   // string | undefined
const nulo          = z.string().nullable();   // string | null
const qualquerCoisa = z.string().nullish();    // string | null | undefined
const comDefault    = z.string().default("anônimo");

// Remover optional/nullable
const obrigatorio2  = opcional.unwrap();       // volta a z.string()


// ============================================================
// 11. TRANSFORM & PREPROCESS
// ============================================================

// transform — transforma o valor APÓS validação
const paraNumero = z.string().transform((val) => parseInt(val, 10));
type ParaNumero  = z.infer<typeof paraNumero>; // number (não string!)

// coerce — converte o tipo ANTES de validar (útil para dados de formulários)
const idNumerico  = z.coerce.number();  // "42" → 42
const dataCoerce  = z.coerce.date();    // "2024-01-01" → Date
const boolCoerce  = z.coerce.boolean(); // 0 → false, 1 → true

// preprocess — executa uma função antes da validação
const stringSegura = z.preprocess(
  (val) => (typeof val === "string" ? val.trim() : val),
  z.string().min(1)
);

// pipe — encadeia schemas (o output de um vira input do próximo)
const stringParaData = z
  .string()
  .pipe(z.coerce.date());


// ============================================================
// 12. REFINE & SUPERREFINE
// ============================================================

// refine — validação customizada simples
const senhaForte = z.string().refine(
  (val) => /[A-Z]/.test(val) && /[0-9]/.test(val),
  { message: "Senha precisa de ao menos uma maiúscula e um número" }
);

// refine com path (para erros em campos específicos de objetos)
const Formulario = z
  .object({
    senha:        z.string(),
    confirmaSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmaSenha, {
    message: "Senhas não conferem",
    path: ["confirmaSenha"],
  });

// superRefine — controle total sobre erros (múltiplos erros, contexto assíncrono)
const MultiplaValidacao = z.string().superRefine((val, ctx) => {
  if (val.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 8,
      type: "string",
      inclusive: true,
      message: "Mínimo de 8 caracteres",
    });
  }
  if (!/[A-Z]/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Precisa de ao menos uma letra maiúscula",
    });
  }
});


// ============================================================
// 13. RECORD, MAP & SET
// ============================================================

// Record — objeto com chaves e valores tipados dinamicamente
const dicionario = z.record(z.string());            // { [key: string]: string }
const porId      = z.record(z.string(), z.number()); // chave string → valor number

// Map
const mapaZod = z.map(z.string(), z.number());

// Set
const conjuntoZod = z.set(z.string());
const setMin = z.set(z.string()).min(1).max(5);


// ============================================================
// 14. PROMISE & FUNCTION
// ============================================================

const promessaDeString = z.promise(z.string());

const funcaoZod = z.function()
  .args(z.string(), z.number())
  .returns(z.boolean());

type MinhaFuncao = z.infer<typeof funcaoZod>; // (arg0: string, arg1: number) => boolean

// Implementando com validação automática dos args/return
const funcaoValidada = funcaoZod.implement((texto, n) => texto.length > n);


// ============================================================
// 15. LAZY & RECURSIVE SCHEMAS
// ============================================================

// Usado para schemas que se referenciam (árvores, menus aninhados etc.)
type Categoria = {
  nome: string;
  subcategorias: Categoria[];
};

const Categoria: z.ZodType<Categoria> = z.lazy(() =>
  z.object({
    nome:          z.string(),
    subcategorias: z.array(Categoria),
  })
);


// ============================================================
// 16. PARSE, SAFEPARSE E PARSEASSYNC
// ============================================================

// parse — lança ZodError se inválido
try {
  const user = Usuario.parse({ id: "abc", nome: "João", email: "j@j.com" });
} catch (err) {
  if (err instanceof z.ZodError) {
    console.log(err.errors);   // array de ZodIssue
    console.log(err.flatten()); // { formErrors, fieldErrors }
  }
}

// safeParse — não lança, retorna { success, data } ou { success, error }
const resultado = Usuario.safeParse({ nome: 123 });

if (resultado.success) {
  console.log(resultado.data);
} else {
  console.log(resultado.error.flatten());
}

// parseAsync / safeParseAsync — para schemas com refine assíncrono
async function validarAsync() {
  const res = await Usuario.safeParseAsync({ id: "abc", nome: "João", email: "j@j.com" });
  return res;
}


// ============================================================
// 17. MENSAGENS DE ERRO CUSTOMIZADAS
// ============================================================

const nomeCustom = z.string({
  required_error:  "Nome é obrigatório",
  invalid_type_error: "Nome deve ser uma string",
}).min(2, "Nome muito curto");

// Mapa de erros global (setErrorMap)
z.setErrorMap((issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type && issue.received === "undefined") {
    return { message: "Campo obrigatório" };
  }
  return { message: ctx.defaultError };
});


// ============================================================
// 18. PADRÕES COMUNS NO CONTEXTO DE FORMS / APIs
// ============================================================

// Schema de login
const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Mínimo de 6 caracteres"),
});
type LoginDTO = z.infer<typeof LoginSchema>;

// Schema de paginação
const PaginacaoSchema = z.object({
  pagina:  z.coerce.number().int().min(1).default(1),
  limite:  z.coerce.number().int().min(1).max(100).default(20),
  ordem:   z.enum(["asc", "desc"]).default("asc"),
});

// Validação de variáveis de ambiente
const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET:   z.string().min(32),
  PORT:         z.coerce.number().default(3000),
  NODE_ENV:     z.enum(["development", "production", "test"]).default("development"),
});

// Chame isso no início da aplicação para falhar rápido
// const env = EnvSchema.parse(process.env);


// ============================================================
// 19. UTILITÁRIOS DE TIPO
// ============================================================

// z.infer — extrai o tipo TypeScript do schema
type TUsuario = z.infer<typeof Usuario>;

// z.input — tipo ANTES das transforms (ex.: .default, .transform)
type InputUsuario = z.input<typeof UsuarioComSenha>;

// z.output — tipo DEPOIS das transforms (igual a z.infer na maioria dos casos)
type OutputUsuario = z.output<typeof UsuarioComSenha>;

// ZodType genérico (útil para funções que aceitam qualquer schema)
function validar<T>(schema: z.ZodType<T>, dados: unknown): T {
  return schema.parse(dados);
}


// ============================================================
// 20. CHEATSHEET RÁPIDO
// ============================================================
//
//  z.string()          → string
//  z.number()          → number
//  z.boolean()         → boolean
//  z.date()            → Date
//  z.literal("x")      → "x"
//  z.enum([...])       → union de literais
//  z.object({...})     → objeto tipado
//  z.array(schema)     → array
//  z.tuple([...])      → tupla
//  z.union([...])      → A | B | C
//  z.intersection()    → A & B
//  z.record(v)         → { [k: string]: V }
//  .optional()         → T | undefined
//  .nullable()         → T | null
//  .nullish()          → T | null | undefined
//  .default(x)         → usa x se undefined
//  .transform(fn)      → transforma após validar
//  .refine(fn, msg)    → validação customizada
//  .parse(data)        → T ou lança ZodError
//  .safeParse(data)    → { success, data } | { success, error }
//  z.infer<typeof S>   → tipo TypeScript do schema S

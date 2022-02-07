import advertisers from "./advertisers"
import banners from "./banners"
import profiles from "./profiles"
import users from "./users"
import blogConsorcios from "./blogConsorcios"
import blogConsumo from "./blogConsumo"
import blogEducacao from "./blogEducacao"
import blogFinancas from "./blogFinancas"
import blogLazer from "./blogLazer"
import blogSaude from "./blogSaude"
import categoriesConsorcios from "./categoriesConsorcios"
import categoriesConsumo from "./categoriesConsumo"
import categoriesEducacao from "./categoriesEducacao"
import categoriesFinancas from "./categoriesFinancas"
import categoriesLazer from "./categoriesLazer"
import categoriesSaude from "./categoriesSaude"

export default [
  {
    header: "LISTAR / EDITAR"
  },
  ...advertisers,
  ...banners,
  ...profiles,
  ...users,
  {
    header: "GET CONSÓRCIOS"
  },
  ...categoriesConsorcios,
  ...blogConsorcios,
  {
    header: "GET CONSUMO"
  },
  ...categoriesConsumo,
  ...blogConsumo,
  {
    header: "GET EDUCAÇÃO"
  },
  ...categoriesEducacao,
  ...blogEducacao,
  {
    header: "GET FINANÇAS"
  },
  ...categoriesFinancas,
  ...blogFinancas,
  {
    header: "GET LAZER"
  },
  ...categoriesLazer,
  ...blogLazer,
  {
    header: "GET SAÚDE"
  },
  ...categoriesSaude,
  ...blogSaude
]

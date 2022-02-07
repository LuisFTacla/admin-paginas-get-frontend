import { Card, Col, FormGroup, Media, Input, Label, Row, Button } from "reactstrap"
import ExtensionsHeader from "../../../@core/components/extensions-header"
import Select from "react-select"
import { ChevronDown, EyeOff, ShoppingCart, Eye, Trash2 } from "react-feather"
import DataTable from "react-data-table-component"
import { useEffect, useState } from "react"
import ModalBanners from "./ModalBanners"
import api from "../../../services/api"
import { toast } from "react-toastify"

const Banners = () => {
  const url = "/banners/"
  const [dataToEdit, setDataToEdit] = useState(null)
  const [items, setItems] = useState([])
  const [reload, setReload] = useState()

  const [shops, setShops] = useState([])
  const [selectAdv, setSelectAdv] = useState([])

  const [selectedRows, setSelectedRows] = useState([])
  const [toggledClearRows, setToggledClearRows] = useState(false)

  const [searchId, setSearchId] = useState("")
  const [searchName, setSearchName] = useState("")
  const [searchAdv, setSearchAdv] = useState("")
  const [filteredById, setFilteredById] = useState([])
  const [filteredByName, setFilteredByName] = useState([])
  const [filteredByAdv, setFilteredByAdv] = useState([])

  //FUNÇÃO DE LISTAGEM DE ANUNCIANTES
  useEffect(async () => {
    try {
      const { data } = await api.get("anunciantes")
      setSelectAdv(data)
    } catch (error) {
      toast.error("Ocorreu um erro ao buscar anunciantes")
      console.log(error)
    }
    setReload(false)
  }, [reload])
  const advOptions = [...selectAdv.map((anunciantes) => ({ value: anunciantes.shopsid, label: anunciantes.shopsname }))]

  //FUNÇÃO PARA ENVIAR UM GET À API - LISTAGEM DE BANNERS
  useEffect(() => {
    async function getItems() {
      try {
        const { data } = await api.get("banners")
        setItems(data)
      } catch (error) {
        toast.error("Ocorreu um erro ao buscar banners")
        console.log(error)
      }
      setReload(false)
    }
    getItems()
  }, [reload])

  //MANTÉM BANNERS SELECIONADOS
  const handleSelectRows = ({ selectedRows }) => {
    setSelectedRows(selectedRows)
  }

  //LIMPA SELEÇÃO DE ANUNCIANTES
  const handleClearRows = () => {
    setToggledClearRows(!toggledClearRows)
  }

  //FUNÇÃO PARA ENVIAR UM PATCH À API - ATUALIZAÇÃO DE BANNER
  async function updateBanner(banner) {
    await api
      .patch(url.concat(banner.id), banner)
      .then((response) => {
        if (response.data.error) {
          toast.error("Ocorreu um erro no servidor")
        } else {
          toast.success("Registro alterado!")
          handleClearRows()
          setReload(true)
        }
      })
      .catch((error) => {
        toast.error("Ocorreu um erro")
        console.log(error)
      })
  }

  //FUNÇÃO PARA ENVIAR UM DELETE À API - DELETAR BANNER
  async function deleteBanner(id) {
    await api
      .delete(url.concat(id))
      .then((response) => {
        if (response.data.error) {
          toast.error("Ocorreu um erro no servidor")
        } else {
          toast.success("Registro excluído!")
          handleClearRows()
          setReload(true)
        }
      })
      .catch((error) => {
        toast.error("Ocorreu um erro")
        console.log(error)
      })
  }

  //FUNÇÃO QUE ATUALIZA O STATUS DOS BANNERS SELECIONADOS
  async function handleDisable() {
    if (selectedRows.length) {
      selectedRows.forEach((item) => {
        item.exibir === 0 ? updateBanner({ ...item, exibir: 1 }) : updateBanner({ ...item, exibir: 0 })
      })
    }
  }

  //FUNÇÃO QUE DELETA BANNERS SELECIONADOS
  async function handleDeleteSelected() {
    selectedRows.forEach((item) => {
      deleteBanner(item.id)
    })
  }

  //RENDERIZAÇÃO DE DADOS NA TABELA
  const dataToRender = () => {
    if (searchName.length && searchId === "") {
      return filteredByName
    } else if (searchId.length && searchName === "") {
      return filteredById
    } else if (searchAdv.length && searchName === "" && searchId === "") {
      return filteredByAdv
    } else {
      return items
    }
  }

  //BUSCA BANNERS POR ID
  const handleIdFilter = (e) => {
    const value = e.target.value
    setSearchId(value)
    let updatedData = []

    if (value.length) {
      updatedData = items.filter((item) => item.id === parseInt(value, 10))
      if (updatedData.length) {
        setFilteredById(updatedData)
      } else {
        setFilteredById([])
      }
    }
  }

  //BUSCA BANNERS POR NOME
  const handleNameFilter = (e) => {
    const value = e.target.value
    setSearchName(value)

    let updatedData = []

    if (value.length) {
      updatedData = items.filter((item) => {
        const startsWith = item.nome.toLowerCase().startsWith(value.toLowerCase())
        const includes = item.nome.toLowerCase().includes(value.toLowerCase())
        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else {
          return null
        }
      })
      setFilteredByName([...updatedData])
    }
  }

  //BUSCA BANNERS POR ANUNCIANTES
  const handleAdvFilter = (e) => {
    const value = e.target.value
    setSearchAdv(value)

    let updatedData = []

    if (value.length) {
      updatedData = items.filter((item) => {
        const startsWith = item.anunciante.toLowerCase().startsWith(value.toLowerCase())
        const includes = item.anunciante.toLowerCase().includes(value.toLowerCase())
        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else {
          return null
        }
      })
      setFilteredByAdv([...updatedData])
    }
  }

  //ATRIBUI NOME ÀS COLUNAS DA TABELA
  const columns = [
    {
      name: "ID",
      selector: "id",
      sortable: true,
      maxWidth: "20px"
    },
    {
      maxWidth: "10px",
      compact: true,
      cell: (record) => {
        return <div>{record.imagem !== null && <Media object className="rounded-square m-1" height="35" width="35" />}</div>
      }
    },
    {
      name: "Nome",
      selector: "nome",
      sortable: true,
      minWidth: "225px"
    },
    {
      name: "Anunciante",
      selector: "anunciante",
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "Status",
      sortable: true,
      selector: "exibir",
      cell: (record) => {
        if (record.exibir === 1) {
          return <Eye size={16} color="green" />
        } else {
          return <EyeOff size={16} color="red" />
        }
      },
      minWidth: "150px"
    }
  ]

  //RENDERIZAÇÃO
  return (
    <div className="w-100">
      <ExtensionsHeader title="Banners" />
      <Card>
        <Row className="mt-1 ml-1 d-flex justify-content-between align-items-center">
          <Col className="col-2">
            <FormGroup>
              <Label>ID:</Label>
              <Input placehoder="Pesquisar" onChange={handleIdFilter} />
            </FormGroup>
          </Col>
          <Col className="col-2">
            <FormGroup>
              <Label>Nome: </Label>
              <Input placehoder="Pesquisar" onChange={handleNameFilter} />
            </FormGroup>
          </Col>
          <Col className="col-2">
          <FormGroup>
              <Label>Anunciante: </Label>
              <Input placehoder="Pesquisar" onChange={handleAdvFilter} />
            </FormGroup>
          </Col>

          <Col className="col-6">
            <Button.Ripple color="primary" className="iconBtn mr-1" onClick={() => setDataToEdit({})}>
              <ShoppingCart size="14" /> Novo Banner
            </Button.Ripple>
            <Button.Ripple color="secondary" className="    mr-1" onClick={handleDisable}>
              <EyeOff size="14" />
            </Button.Ripple>
            <Button.Ripple color="danger" className="" onClick={handleDeleteSelected}>
              <Trash2 size="14" />
            </Button.Ripple>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <DataTable
              columns={columns}
              data={dataToRender()}
              className="react-dataTable"
              noHeader
              highlightOnHover
              selectableRowsHighlight
              selectableRows
              onRowClicked={(record) => setDataToEdit(record)}
              onSelectedRowsChange={handleSelectRows}
              clearSelectedRows={toggledClearRows}
              sortIcon={<ChevronDown size={10} />}
              pagination
              paginationPerPage={50}
              paginationRowsPerPageOptions={[10, 25, 50, 100, 200, 500]}
              paginationComponentOptions={{
                rowsPerPageText: "Visualizar:",
                rangeSeparatorText: "de"
              }}
            />
          </Col>
        </Row>
      </Card>
      <ModalBanners isOpen={dataToEdit !== null} handleUpdate={() => setReload(true)} handleToggle={() => setDataToEdit(null)} dataToEdit={dataToEdit} />
    </div>
  )
}

export default Banners

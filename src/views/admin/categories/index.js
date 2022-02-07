import { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { ChevronDown, Eye, EyeOff, List, Trash2 } from "react-feather"
import { toast } from "react-toastify"
import { Button, Card, CardHeader, Col, FormGroup, Input, Label, Media, Row } from "reactstrap"
import ExtensionsHeader from "../../../@core/components/extensions-header"
import api from "../../../services/api"
import ModalCategories from "./ModalCategories"

const Categories = (props) => {
  const { page, labelPage } = props
  const url = "categorias/"
  const title = `Categorias - ${labelPage}`
  const [dataToEdit, setDataToEdit] = useState(null)
  const [items, setItems] = useState([])
  const [reload, setReload] = useState()

  const [searchId, setSearchId] = useState("")
  const [searchName, setSearchName] = useState("")
  const [filteredById, setFilteredById] = useState([])
  const [filteredByName, setFilteredByName] = useState([])

  const [selectedRows, setSelectedRows] = useState([])
  const [toggledClearRows, setToggleClearRows] = useState(false)

  //FUNÇÃO PARA ENVIAR UM GET À API - LISTAGEM DE CATEGORIAS
  useEffect(() => {
    async function getItems() {
      try {
        const { data } = await api.get(`categoriasPagina/${page}`)
        setItems(data)
      } catch (error) {
        toast.error("Ocorreu um erro ao buscar categorias")
        console.log(error)
      }
      setReload(false)
    }
    getItems()
  }, [reload])

  //MANTÉM CATEGORIAS SELECIONADAS
  const handleSelectRows = ({ selectedRows }) => {
    setSelectedRows(selectedRows)
  }

  //LIMPA A SELEÇÃO DE CATEGORIAS
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows)
  }

  //FUNÇÃO PARA ENVIAR UM PATCH À API - ATUALIZAÇÃO DE CATEGORIA
  async function updateCategory(categoria) {
    await api
      .patch(url.concat(categoria.id), categoria)
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

  //FUNÇÃO PARA ENVIAR UM DELETE À API - DELETAR CATEGORIA
  async function deleteCategory(id) {
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

  //FUNÇÃO QUE ATUALIZA O STATUS DAS CATEGORIAS SELECIONADAS
  async function handleDisable() {
    if (selectedRows.length) {
      selectedRows.forEach((item) => {
        item.status === 0 ? updateCategory({ ...item, status: 1 }) : updateCategory({ ...item, status: 0 })
      })
    }
  }

  //FUNÇÃO QUE DELETA CATEGORIAS SELECIONADAS
  async function handleDeleteSelected() {
    selectedRows.forEach((item) => {
      deleteCategory(item.id)
    })
  }

  //RENDERIZAÇÃO DE DADOS NA TABELA
  const dataToRender = () => {
    if (searchName.length && searchId === "") {
      return filteredByName
    } else if (searchId.length && searchName === "") {
      return filteredById
    } else {
      return items
    }
  }

  //BUSCA CATEGORIAS POR ID
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

  //BUSCA CATEGORIAS POR NOME
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

  //ATRIBUI NOME ÀS COLUNAS DA TABELA
  const columns = [
    {
      name: "ID",
      selector: "id",
      sortable: true,
      maxWidth: "10px"
    },
    {
      name: "Nome",
      selector: "nome",
      sortable: true,
      minWidth: "250px",
      cell: (record) => {
        return <div>{record.nome}</div>
      }
    },
    {
      name: "Status",
      sortable: true,
      selector: "status",
      cell: (record) => {
        if (record.status !== 0) {
          return <Eye size={16} color="green" />
        } else {
          return <EyeOff size={16} color="red" />
        }
      },
      maxWidth: "10px"
    }
  ]

  //RENDERIZAÇÃO
  return (
    <div className="w-100">
      <ExtensionsHeader title={title} />
      <Card>
        <Row className="mt-1 ml-1 d-flex justify-content-between align-items-center">
          <Col className="col-2">
            <FormGroup>
              <Label>ID:</Label>
              <Input placeholder="Pesquisar" value={searchId} onChange={handleIdFilter} />
            </FormGroup>
          </Col>
          <Col className="col-2">
            <FormGroup>
              <Label>Nome:</Label>
              <Input placeholder="Pesquisar" value={searchName} onChange={handleNameFilter} />
            </FormGroup>
          </Col>
          <Col sm="8">
            <CardHeader className="justify-content-start">
              <Button.Ripple color="primary" className="iconBtn mr-1" onClick={() => setDataToEdit({})}>
                <List size="14" /> Nova Categoria
              </Button.Ripple>
              <Button.Ripple color="secondary" className="mr-1" onClick={handleDisable}>
                <EyeOff size="14" />
              </Button.Ripple>
              <Button.Ripple color="danger" className="" onClick={handleDeleteSelected}>
                <Trash2 size="14" />
              </Button.Ripple>
            </CardHeader>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <DataTable
              columns={columns}
              data={dataToRender()}
              className="react-dataTable"
              noHeader
              striped
              highlightOnHover
              selectableRows
              selectableRowsHighlight
              onRowClicked={(record) => setDataToEdit(record)}
              onSelectedRowsChange={handleSelectRows}
              clearSelectedRows={toggledClearRows}
              sortIcon={<ChevronDown size={10} />}
              pagination
              paginationPerPage={50}
              paginationRowsPerPageOptions={[10, 25, 50, 100, 200, 500]}
              paginationComponentOptions={{
                rowsPerPageText: "Visualizar",
                rangeSeparatorText: "de"
              }}
            />
          </Col>
        </Row>
      </Card>
      <ModalCategories isOpen={dataToEdit !== null} handleUpdate={() => setReload(true)} handleToggle={() => setDataToEdit(null)} dataToEdit={dataToEdit} categories={items} page={page} />
    </div>
  )
}

export default Categories

import { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { CheckCircle, ChevronDown, Delete, Edit, Edit3, EyeOff, Loader, Trash2, XCircle } from "react-feather"
import { toast } from "react-toastify"
import { Button, Card, CardHeader, Col, FormGroup, Input, Label, Row } from "reactstrap"
import ExtensionsHeader from "../../../@core/components/extensions-header"
import api from "../../../services/api"
import ModalBlog from "./ModalBlog"
import { isUserLoggedIn } from "../../../auth/utils"

const Blog = (props) => {
  const { page, labelPage } = props
  const url = "blog/"
  const title = `Blog -  ${labelPage}`
  const [dataToEdit, setDataToEdit] = useState(null)
  const [items, setItems] = useState([])
  const [reload, setReload] = useState()

  const [searchId, setSearchId] = useState("")
  const [searchTitle, setSearchTitle] = useState("")
  const [filteredById, setFilteredById] = useState([])
  const [filteredByTitle, setFilteredByTitle] = useState([])

  const [selectedRows, setSelectedRows] = useState([])
  const [toggleClearRows, setToggleClearRows] = useState(false)

  //Usuário
  const [userData, setUserData] = useState(null)
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem("userData")))
    }
  }, [])

  //FUNÇÃO PARA ENVIAR UM GET À API - LISTAGEM DE NOTÍCIAS
  useEffect(() => {
    async function getItems() {
      try {
        const { data } = await api.get(`blogPagina/${page}`)
        setItems(data)
      } catch (error) {
        toast.error("Ocorreu um erro ao buscar postagens no blog")
        console.log(error)
      }
      setReload(false)
    }
    getItems()
  }, [reload])

  //MANTÉM NOTÍCIAS SELECIONADAS
  const handleSelectRows = ({ selectedRows }) => {
    setSelectedRows(selectedRows)
  }

  //LIMPA A SELEÇÃO DE NOTÍCIAS
  const handleClearRows = () => {
    setToggleClearRows(!toggleClearRows)
  }

  //FUNÇÃO PARA ENVIAR UM PATCH À API - ATUALIZAÇÃO DE NOTÍCIA - NÃO FUNCIONAL
  async function updateBlog(blog) {
    await api
      .patch(url.concat(blog.id), blog)
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

  //FUNÇÃO PARA ENVIAR UM DELETE À API - DELETAR NOTÍCIA
  async function deleteBlog(id) {
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

  //FUNÇÃO QUE ATUALIZA O STATUS DAS NOTÍCIAS SELECIONADAS - NÃO FUNCIONAL
  async function handleDisable() {
    if (selectedRows.length) {
      selectedRows.forEach((item) => {
        item.status === 1 ? updateBlog({ ...item, status: 2 }) : updateBlog({ ...item, status: 1 })
      })
    }
  }

    //FUNÇÃO QUE DELETA NOTÍCIAS SELECIONADAS
  async function handleDeleteSelected() {
    selectedRows.forEach((item) => {
      deleteBlog(item.id)
    })
  }

  //RENDERIZAÇÃO DE DADOS NA TABELA
  const dataToRender = () => {
    if (searchTitle.length && searchId === "") {
      return filteredByTitle
    } else if (searchId.length && searchTitle === "") {
      return filteredById
    } else {
      return items
    }
  }

  //BUSCA NOTÍCIAS POR ID
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

  //BUSCA NOTÍCIAS POR TÍTULO
  const handleTitleFilter = (e) => {
    const value = e.target.value
    setSearchTitle(value)

    let updatedData = []

    if (value.length) {
      updatedData = items.filter((item) => {
        const startsWith = item.titulo.toLowerCase().startsWith(value.toLowerCase())
        const includes = item.titulo.toLowerCase().includes(value.toLowerCase())
        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else {
          return null
        }
      })
      setFilteredByTitle([...updatedData])
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
      name: "Categoria",
      selector: "categoria",
      sortable: true,
      minWidth: "50px"
    },
    {
      name: "Título",
      selector: "titulo",
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "Data",
      selector: (record) => {
        const date = new Date(record.data)
        return date.toLocaleDateString()
      },
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "Status",
      selector: (record) => {
        if (record.status === 1) {
          return <CheckCircle size={16} color="green" />
        } else if (record.status === 2) {
          return <Loader size={16} color="orange" />
        } else if (record.status === 3) {
          return <XCircle size={16} color="red" />
        }
      },
      sortable: true,
      minWidth: "150px"
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
              <Label>Título:</Label>
              <Input placeholder="Pesquisar" value={searchTitle} onChange={handleTitleFilter} />
            </FormGroup>
          </Col>
          <Col sm="8">
            <CardHeader className="justify-content-start">
              <Button.Ripple color="primary" className="iconBtn mr-1" onClick={() => setDataToEdit({})}>
                <Edit3 size="14" />
                Novo Post
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
              clearSelectedRows={toggleClearRows}
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
      <ModalBlog isOpen={dataToEdit !== null} handleUpdate={() => setReload(true)} handleToggle={() => setDataToEdit(null)} dataToEdit={dataToEdit} blog={items} page={page} />
    </div>
  )
}

export default Blog

import { Row, Col, Card, CardHeader, Button, FormGroup, Label, Input, Media } from "reactstrap"
import ExtensionsHeader from "../../../@core/components/extensions-header"
import { ChevronDown, ShoppingCart, Trash2, EyeOff, Eye } from "react-feather"
import DataTable from "react-data-table-component"
import { useEffect, useState } from "react"
import ModalAdvertisers from "./ModalAdvertisers"
import api from "../../../services/api"
import { toast } from "react-toastify"

const Advertisers = () => {
  const url = "/anunciantes/"
  const [dataToEdit, setDataToEdit] = useState(null)
  const [items, setItems] = useState([])
  const [reload, setReload] = useState()

  const [searchId, setSearchId] = useState("")
  const [searchName, setSearchName] = useState("")
  const [filteredById, setFilteredById] = useState([])
  const [filteredByName, setFilteredByName] = useState([])

  const [selectedRows, setSelectedRows] = useState([])
  const [toggledClearRows, setToggleClearRows] = useState(false)

  //FUNÇÃO PARA ENVIAR UM GET À API - LISTAGEM DE ANUNCIANTES
  useEffect(() => {
    async function getItems() {
      try {
        const { data } = await api.get("anunciantes")
        setItems(data)
      } catch (error) {
        toast.error("Ocorreu um erro ao buscar anunciantes")
        console.log(error)
      }
      setReload(false)
    }
    getItems()
  }, [reload])

  //MANTÉM ANUNCIANTES SELECIONADOS
  const handleSelectRows = ({ selectedRows }) => {
    setSelectedRows(selectedRows)
  }

  //LIMPA A SELEÇÃO DE ANUNCIANTES
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows)
  }

  //FUNÇÃO PARA ENVIAR UM PATCH À API - ATUALIZAÇÃO DE ANUNCIANTE
  async function updateAdvertiser(anunciante) {
    await api
      .patch(url.concat(anunciante.shopsid), anunciante)
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

  //FUNÇÃO PARA ENVIAR UM DELETE À API - DELETAR ANUNCIANTE
  async function deleteAdvertiser(id) {
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

  //FUNÇÃO QUE ATUALIZA O STATUS DOS ANUNCIANTES SELECIONADOS
  async function handleDisable() {
    if (selectedRows.length) {
      selectedRows.forEach((item) => {
        item.shopsstatus === 0 ? updateAdvertiser({ ...item, shopsstatus: 1 }) : updateAdvertiser({ ...item, shopsstatus: 0 })
      })
    }
  }

  //FUNÇÃO QUE DELETA ANUNCIANTES SELECIONADOS
  async function handleDeleteSelected() {
    selectedRows.forEach((item) => {
      deleteAdvertiser(item.shopsid)
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

  //BUSCA ANUNCIANTES POR ID
  const handleIdFilter = (e) => {
    const value = e.target.value
    setSearchId(value)
    let updatedData = []

    if (value.length) {
      updatedData = items.filter((item) => item.shopsid === parseInt(value, 10))
      if (updatedData.length) {
        setFilteredById(updatedData)
      } else {
        setFilteredById([])
      }
    }
  }

  //BUSCA ANUNCIANTES POR NOME
  const handleNameFilter = (e) => {
    const value = e.target.value
    setSearchName(value)

    let updatedData = []

    if (value.length) {
      updatedData = items.filter((item) => {
        const startsWith = item.shopsname.toLowerCase().startsWith(value.toLowerCase())
        const includes = item.shopsname.toLowerCase().includes(value.toLowerCase())
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
      selector: "shopsid",
      sortable: true,
      maxWidth: "20px"
    },
    {
      maxWidth: "10px",
      compact: true,
      cell: (record) => {
        return <div>{record.shopslogo !== "" && <Media object className="rounded-square m-1" height="35" widht="35" />}</div>
      }
    },
    {
      name: "Nome",
      selector: "shopsname",
      sortable: true,
      minWidth: "225px",
      cell: (record) => {
        return <div>{record.shopsname}</div>
      }
    },
    {
      name: "Banners",
      selector: "number_offers",
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "Cliques",
      selector: "clicks_offers",
      sortable: true,
      minWidth: "225px"
    },
    {
      name: "Status",
      sortable: true,
      selector: "shopsstatus",
      cell: (record) => {
        if (record.shopsstatus === 1) {
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
    <div>
      <ExtensionsHeader title="Anunciantes" />
      <Card>
        <Row className="mt-1 ml-1 d-flex justify-content-between align-items-center">
          <Col className="col-2">
            <FormGroup>
              <Label for="idOffer">ID:</Label>
              <Input id="idOffer" placeholder="Pesquisar" onChange={handleIdFilter} />
            </FormGroup>
          </Col>
          <Col className="col-2">
            <FormGroup>
              <Label for="nameOffer">Nome:</Label>
              <Input id="nameOffer" placeholder="Pesquisar" onChange={handleNameFilter} />
            </FormGroup>
          </Col>
          <Col sm="8">
            <CardHeader className="justify-content-start">
              <Button.Ripple color="primary" className="iconBtn mr-1" onClick={() => setDataToEdit({})}>
                <ShoppingCart size="14" /> Novo Anunciante
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
      <ModalAdvertisers isOpen={dataToEdit !== null} handleUpdate={() => setReload(true)} handleToggle={() => setDataToEdit(null)} dataToEdit={dataToEdit} />
    </div>
  )
}

export default Advertisers

import { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { User, Trash2, EyeOff, Eye, ChevronDown } from "react-feather"
import { toast } from "react-toastify"
import { Row, Col, Card, CardHeader, Button } from "reactstrap"
import ExtensionsHeader from "../../../@core/components/extensions-header"
import api from "../../../services/api"
import ModalUsers from "./ModalUsers"

const Users = () => {
  const url = "usuarios/"
  const [dataToEdit, setDataToEdit] = useState(null)
  const [items, setItems] = useState([])
  const [reload, setReload] = useState()

  const [selectedRows, setSelectedRows] = useState([])
  const [toggledClearRows, setToggledClearRows] = useState(false)

  //Listar usuários
  useEffect(() => {
    async function getItems() {
      try {
        const { data } = await api.get("usuarios")
        setItems(data)
      } catch (error) {
        toast.error("Ocorreu um erro ao buscar usuários")
        console.log(error)
      }
      setReload(false)
    }
    getItems()
  }, [reload])

  const handleSelectedRows = ({ selectedRows }) => {
    setSelectedRows(selectedRows)
  }

  const handleClearRows = () => {
    setToggledClearRows(!toggledClearRows)
  }

  async function updateUser(usuario) {
    await api
      .patch(url.concat(usuario.id), usuario)
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

  async function deleteUser(id) {
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

  async function handleDisable() {
    if (selectedRows.length) {
      selectedRows.forEach((item) => {
        item.status === 0 ? updateUser({ ...item, status: 1 }) : updateUser({ ...item, status: 0 })
      })
    }
  }

  async function handleDeleteSelected() {
    selectedRows.forEach((item) => {
      deleteUser(item.id)
    })
  }

  //Dados para renderizar na tabela
  const dataToRender = () => {
    return items
  }

  const columns = [
    {
      name: "ID",
      selector: "id",
      sortable: true,
      maxWidth: "20px"
    },
    {
      name: "Usuário",
      selector: "usuario",
      sortable: true,
      minWidth: "25px"
    },
    {
      name: "Login",
      selector: "login",
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
      minWidth: "225px"
    },
    {
      name: "Perfil",
      selector: "perfil",
      sortable: true,
      minWidth: "225px"
    },
    {
      name: "Status",
      selector: (record) => {
        if (record.status === 1) {
          return <Eye size={16} color="green" />
        } else {
          return <EyeOff size={16} color="red" />
        }
      },
      sortable: true,
      minWidth: "150px"
    }
  ]

  return (
    <div className="w-100">
      <ExtensionsHeader title="Usuários" />
      <Card>
        <Row>
          <CardHeader>
            <Button.Ripple color="primary" className="iconBtn mr-1" onClick={() => setDataToEdit({})}>
              <User size="14" /> Novo Usuário
            </Button.Ripple>
            <Button.Ripple color="secondary" className="mr-1" onClick={handleDisable}>
              <EyeOff size="14" />
            </Button.Ripple>
            <Button.Ripple color="danger" className="" onClick={handleDeleteSelected}>
              <Trash2 size="14" />
            </Button.Ripple>
          </CardHeader>
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
              onSelectedRowsChange={handleSelectedRows}
              clearSelectedRows={toggledClearRows}
              sortIcon={<ChevronDown size={10} />}
              pagination
              paginationPerPage={50}
              paginationRowsPerPageOptions={[10, 25, 50, 100, 200, 500]}
              paginationComponentOptions={{ rowsPerPageText: "Visualizar:", rangeSeparatorText: "de" }}
            />
          </Col>
        </Row>
      </Card>
      <ModalUsers isOpen={dataToEdit !== null} handleUpdate={() => setReload(true)} handleToggle={() => setDataToEdit(null)} dataToEdit={dataToEdit} />
    </div>
  )
}

export default Users

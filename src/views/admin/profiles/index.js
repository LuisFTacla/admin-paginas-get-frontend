import { useState } from "react"
import DataTable from "react-data-table-component"
import { ChevronDown, File } from "react-feather"
import { Button, Card, CardHeader, Col, Row, Spinner } from "reactstrap"
import ExtensionsHeader from "../../../@core/components/extensions-header"

const Profiles = () => {
  const [dataToEdit, setDataToEdit] = useState(null)
  const [items, setItems] = useState([])
  const [pending, setPending] = useState([])

  const columns = [
    {
      name: "ID",
      selector: "profilesid",
      sortable: true,
      maxWidth: "20px"
    },
    {
      name: "Nome",
      selector: "profilesname",
      sortable: true,
      minWidth: "225px"
    },
    {
      name: "Origem",
      selector: "profilessource",
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "Email",
      selector: "profilesemail",
      sortable: true,
      minWidth: "225px"
    },
    {
      name: "CPF",
      selector: "profilesdoc",
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "IP",
      selector: "profilesip",
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "Data",
      selector: "profilescreatedate",
      sortable: true,
      minWidth: "150px"
    }
  ]

  const CustomLoader = () => (
    <div className="row m-3">
      <div className="mr-2">Carregando</div>
      <Spinner />
    </div>
  )

  return (
    <div className="w-100">
      <ExtensionsHeader title="Cadastros" />
      <Card>
        <Row>
          <Col sm="12">
            <CardHeader>
              <Button.Ripple
                color="info"
                className="iconBtn"
                onClick={() => setDataToEdit({})}
              >
                <File size="14" /> Exportar XLS
              </Button.Ripple>
            </CardHeader>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <DataTable
              columns={columns}
              data={items.data}
              className="react-dataTable"
              noHeader
              striped
              selectableRows
              sortIcon={<ChevronDown size={10} />}
              pagination
              paginationPerPage={50}
              paginationRowsPerPageOptions={[10, 25, 50, 100, 200, 500]}
              paginationComponentOptions={{
                rowsPerPageText: "Visualizar:",
                rangeSeparatorText: "de"
              }}
              progressPending={pending}
              progressComponent={<CustomLoader />}
            />
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default Profiles

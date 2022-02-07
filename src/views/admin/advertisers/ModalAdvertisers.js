import { useEffect, useState } from "react"
import { Button, Card, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from "reactstrap"
import Uppy from "@uppy/core"
import thumbnailGenerator from "@uppy/thumbnail-generator"
import { DragDrop } from "@uppy/react"
import api from "../../../services/api"
import { toast } from "react-toastify"

const ModalAdvertisers = (props) => {
  const url = "/anunciantes"
  const { isOpen, dataToEdit, handleToggle, handleUpdate } = props
  const [img, setImg] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }

  //ATRIBUIÇÃO DE VALORES INICIAIS PARA OS CAMPOS DA TABELA
  const initialStateFields = {
    shopslogo: "",
    shopslink: "",
    shopsname: "",
    number_offers: 0,
    clicks_offers: 0,
    shopsstatus: 0
  }
  const [fields, setFields] = useState(initialStateFields)

  //UPLOAD DE ARQUIVOS - NÃO FUNCIONAL AINDA
  const FileUploaderBasic = () => {
    const uppy = new Uppy({
      restrictions: { maxNumberOfFiles: 1 },
      autoProceed: true
    })
    uppy.use(thumbnailGenerator)
    uppy.on("thumbnail:generated", (file, preview) => {
      setImg(preview)
      setFile(file)
    })

    return (
      <Card>
        <DragDrop
          width="100%"
          height="130px"
          note="Arraste ou abra seus arquivos"
          uppy={uppy}
          locale={{
            strings: {
              dropHereOr: "%{browse}",
              browse: "Importar arquivos"
            }
          }}
        />
        {img !== null ? <img className="rounded mt-2" src={img} alt="avatar" /> : null}
      </Card>
    )
  }

  //ATRIBUIÇÃO DE VALORES OBTIDOS NO MODAL PARA ENVIAR À BASE DE DADOS
  useEffect(() => {
    if (!isOpen) return
    if (Object.keys(dataToEdit).length === 0) return setFields(initialStateFields)

    setFields({
      shopsid: dataToEdit.shopsid,
      shopslogo: dataToEdit.shopslogo,
      shopslink: dataToEdit.shopslink,
      shopsname: dataToEdit.shopsname,
      number_offers: dataToEdit.number_offers,
      clicks_offers: dataToEdit.clicks_offers,
      shopsstatus: dataToEdit.shopsstatus
    })
  }, [dataToEdit])

  //FUNÇÃO PARA ENVIAR UM POST À API - CRIAÇÃO DE ANUNCIANTE
  async function create() {
    console.log(fields)
    await api
      .post("anunciantes", fields)
      .then((response) => {
        if (response.data.error) {
          toast.error("Ocorreu um erro no servidor")
        } else {
          toast.success("Registro inserido com sucesso!")
          handleToggle()
          handleUpdate()
          setLoading(false)
        }
      })
      .catch((error) => {
        toast.error("Ocorreu um erro")
        console.log(error)
      })
  }

  //FUNÇÃO PARA ENVIAR UM PATCH À API - ATUALIZAÇÃO DE ANUNCIANTE
  async function update() {
    console.log(fields)
    await api
      .patch(`anunciantes/${fields.shopsid}`, fields)
      .then((response) => {
        if (response.status !== 200) {
          toast.error("Ocorreu um erro no servidor")
        } else {
          toast.success("Registro alterado com sucesso!")
          handleToggle()
          handleUpdate()
          setLoading(false)
        }
      })
      .catch((error) => {
        toast.error("Ocorreu um erro")
        setLoading(false)
        console.log(error)
      })
  }

  //FUNÇÃO EXECUTADA AO CLICAR EM 'SALVAR', DEFININDO SE SERÁ CRIAÇÃO OU ATUALIZAÇÃO DE ANUNCIANTE
  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    if (dataToEdit.shopsid) {
      await update()
    } else {
      await create()
    }
  }

  //COMPONENTE RENDERIZADO DURANTE CARREGAMENTO
  const spinner = () => {
    if (loading) {
      return <Spinner color="info" />
    }
  }

  //RENDERIZAÇÃO DO MODAL
  return (
    <div className="basic-modal">
      <Modal className="modal-lg" isOpen={isOpen} toggle={handleToggle}>
        <Form className="w-100" onSubmit={handleSubmit}>
          <ModalHeader toggle={handleToggle}>{dataToEdit && dataToEdit.shopsid ? "Editar Anunciante" : "Novo Anunciante"}</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="6">
                <FormGroup>
                  <Label>Nome</Label>
                  <Input type="text" placeholder="Nome" value={fields.shopsname} onChange={(e) => setFields({ ...fields, shopsname: e.target.value })} />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label>Página Web</Label>
                  <Input type="text" placeholder="http://" value={fields.shopslink} onChange={(e) => setFields({ ...fields, shopslink: e.target.value })} />
                </FormGroup>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col sm="6">
                <FormGroup>
                  <Label for="select-payment">Arquivo JPG ou PNG</Label>
                  <FileUploaderBasic />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            {spinner()}
            <FormGroup className="d-flex mb-0">
              <Button.Ripple className="mr-1" color="primary" type="submit">
                Salvar
              </Button.Ripple>
              <Button.Ripple outline color="secondary" type="reset" onClick={() => handleToggle()}>
                Cancelar
              </Button.Ripple>
            </FormGroup>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  )
}

export default ModalAdvertisers

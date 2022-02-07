import { useState, useEffect } from "react"
import Select from "react-select"
import Uppy from "@uppy/core"
import { DragDrop } from "@uppy/react"
import thumbnailGenerator from "@uppy/thumbnail-generator"
import "uppy/dist/uppy.css"
import "@uppy/status-bar/dist/style.css"
import "@styles/react/libs/file-uploader/file-uploader.scss"
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from "reactstrap"
import api from "../../../services/api"
import { toast } from "react-toastify"

const ModalCategories = (props) => {
  const url = "/categorias" //VAI RECEBER DE INDEX.JS
  const { isOpen, dataToEdit, handleToggle, handleUpdate, categories, page, labelPage } = props
  const [img, setImg] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }

  const [userData, setUserData] = useState(null)

  //ATRIBUIÇÃO DE VALORES INICIAIS PARA OS CAMPOS DA TABELA
  const initialStateFields = {
    nome: "",
    pagina: page,
    status: 1
  }
  const [fields, setFields] = useState(initialStateFields)

  //ATRIBUIÇÃO DE VALORES OBTIDOS NO MODAL PARA ENVIAR À BASE DE DADOS
  useEffect(() => {
    if (!isOpen) return
    if (Object.keys(dataToEdit).length === 0) return setFields(initialStateFields)

    setFields({
      id: dataToEdit.id,
      nome: dataToEdit.nome,
      pagina: dataToEdit.pagina,
      status: dataToEdit.status
    })
  }, [dataToEdit])

  //FUNÇÃO PARA ENVIAR UM POST À API - CRIAÇÃO DE CATEGORIA  
  async function create() {
    console.log(fields)
    await api
      .post("categorias", fields)
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

  //FUNÇÃO PARA ENVIAR UM PATCH À API - ATUALIZAÇÃO DE CATEGORIA  
  async function update() {
    console.log(fields)
    await api
      .patch(`categorias/${fields.id}`, fields)
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

  //FUNÇÃO EXECUTADA AO CLICAR EM 'SALVAR', DEFININDO SE SERÁ CRIAÇÃO OU ATUALIZAÇÃO DE CATEGORIA
  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    if (dataToEdit.id) {
      await update()
    } else {
      await create()
    }
  }

  //ARRAY DE OPÇÕES DE STATUS
  const statusOptions = [
    { value: 1, label: "Ativo" },
    { value: 0, label: "Inativo" }
  ]

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
          <ModalHeader toggle={handleToggle}>{dataToEdit && dataToEdit.id ? "Editar Categoria" : "Nova Categoria"}</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="6">
                <FormGroup>
                  <Label for="nameMulti">Nome</Label>
                  <Input type="text" maxLength="70" placeholder="Nome" defaultValue={fields.nome} onChange={(e) => setFields({ ...fields, nome: e.target.value })} />
                  {fields.nome.length >= 70 && <Label className="text-danger ml-1">Máximo 70 caracteres.</Label>}
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <Label>Exibir</Label>
                  <Select
                    placeholder="Selecione"
                    className="react-select"
                    classNamePrefix="select"
                    options={statusOptions}
                    value={fields.status !== null ? statusOptions.find((item) => item.value === fields.status) : ""}
                    onChange={(item) => setFields({ ...fields, status: item.value })}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            {spinner()}
            <Button.Ripple className="mr-1" color="primary" type="submit">
              Salvar
            </Button.Ripple>
            <Button.Ripple outline color="secondary" type="reset" onClick={() => handleToggle()}>
              Cancelar
            </Button.Ripple>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  )
}

export default ModalCategories

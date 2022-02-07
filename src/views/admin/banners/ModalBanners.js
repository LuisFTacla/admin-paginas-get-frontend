import { useEffect, useState } from "react"
import Uppy from "@uppy/core"
import thumbnailGenerator from "@uppy/thumbnail-generator"
import { DragDrop } from "@uppy/react"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col, Input, FormGroup, Label, Card, Spinner } from "reactstrap"
import Select from "react-select"
import api from "../../../services/api"
import { toast } from "react-toastify"

const ModalBanners = (props) => {
  const url = "/banners"
  const { isOpen, dataToEdit, handleToggle, handleUpdate } = props
  const [img, setImg] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState()

  //ATRIBUIÇÃO DE VALORES INICIAIS PARA OS CAMPOS DA TABELA
  const initialStateFields = {
    imagem: "",
    nome: "",
    pagina: "",
    cabecalho: "",
    anunciante: "",
    url: "",
    exibir: 0
  }
  const [fields, setFields] = useState(initialStateFields)

  const [selectShops, setSelectShops] = useState([])

  //FUNÇÃO QUE ENVIA UM GET À API, RETORNANDO LISTA DE ANUNCIANTES PARA SELETOR
  const [selectAdv, setSelectAdv] = useState([])
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

  //ARRAY DE OPÇÕES DE ANUNCIANTES
  const advOptions = [...selectAdv.map((anunciantes) => ({ value: anunciantes.shopsid, label: anunciantes.shopsname }))]

  //ARRAY DE OPÇÕES DE SITES
  const sites = [
    { value: "101", label: "Get Consórcios" },
    { value: "102", label: "Get Consumo" },
    { value: "103", label: "Get Educação" },
    { value: "104", label: "Get Finanças" },
    { value: "105", label: "Get Lazer" },
    { value: "106", label: "Get Saúde" },
    { value: "100", label: "Todos" }
  ]

  //ARRAY DE OPÇÕES DE STATUS
  const statusOptions = [
    { value: 1, label: "Ativo" },
    { value: 0, label: "Inativo" }
  ]

  //UPLOAD DE ARQUIVOS - NÃO FUNCIONAL
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
      <Row className="text-center">
        <Col sm="6">
          <DragDrop
            width="100%"
            height="120px"
            note="Arraste ou abra seus arquivos"
            uppy={uppy}
            locale={{
              strings: {
                dropHereOr: "%{browse}",
                browse: "Importar arquivos"
              }
            }}
          />
        </Col>
        <Col sm="6">{img !== null ? <img className="rounded mt-2 w-50" src={img} alt="avatar" /> : null}</Col>
      </Row>
    )
  }

  //ATRIBUIÇÃO DE VALORES OBTIDOS NO MODAL PARA ENVIAR À BASE DE DADOS
  useEffect(() => {
    if (!isOpen) return
    if (Object.keys(dataToEdit).length === 0) return setFields(initialStateFields)

    setFields({
      id: dataToEdit.id,
      imagem: dataToEdit.imagem,
      nome: dataToEdit.nome,
      pagina: dataToEdit.pagina,
      cabecalho: dataToEdit.cabecalho,
      anunciante: dataToEdit.anunciante,
      url: dataToEdit.url,
      exibir: dataToEdit.exibir
    })
  }, [dataToEdit])

  //FUNÇÃO PARA ENVIAR UM POST À API - CRIAÇÃO DE BANNER
  async function create() {
    console.log(fields)
    await api
      .post("banners", file, fields)
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

  //FUNÇÃO PARA ENVIAR UM PATCH À API - ATUALIZAÇÃO DE BANNER
  async function update() {
    console.log(fields)
    await api
      .patch(`banners/${fields.id}`, fields)
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

  //FUNÇÃO EXECUTADA AO CLICAR EM 'SALVAR', DEFININDO SE SERÁ CRIAÇÃO OU ATUALIZAÇÃO DE BANNER
  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    if (dataToEdit.id) {
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
    <div className="basic modal">
      <Modal className="modal-lg" isOpen={isOpen} toggle={handleToggle}>
        <Form className="w-100" onSubmit={handleSubmit}>
          <ModalHeader toggle={handleToggle}>{dataToEdit && dataToEdit.id ? "Editar Banner" : "Novo Banner"}</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="6">
                <FormGroup>
                  <Label>Nome</Label>
                  <Input type="text" placeholder="Nome" maxLength="70" value={fields.nome} onChange={(e) => setFields({ ...fields, nome: e.target.value })} />
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <Label>Site</Label>
                  <Select
                    placeholder="Selecione"
                    className="react-select"
                    classNamePrefix="select"
                    options={sites}
                    value={fields.pagina !== null ? sites.find((item) => item.value === fields.pagina) : ""}
                    onChange={(item) => setFields({ ...fields, pagina: item.label })}
                  />
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
                    value={fields.exibir !== null ? sites.find((item) => item.value === fields.exibir) : ""}
                    onChange={(item) => setFields({ ...fields, exibir: item.value })}
                  />
                </FormGroup>
              </Col>
              <Col sm="8">
                <FormGroup>
                  <Label for="nameMulti">Título cabeçalho</Label>
                  <Input type="text" placeholder="" value={fields.cabecalho} onChange={(e) => setFields({ ...fields, cabecalho: e.target.value })} />
                  {fields.cabecalho.length >= 70 && <Label className="text-danger">Máximo 70 caracteres.</Label>}
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label for="select-payment">Anunciante</Label>
                  <Select
                    className="react-select"
                    classNamePrefix="select"
                    options={advOptions}
                    value={fields.anunciante !== null ? advOptions.find((item) => item.value === fields.anunciante) : ""}
                    onChange={(item) => setFields({ ...fields, anunciante: item.label })}
                  />
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="nameMulti">URL</Label>
                  <Input type="text" placeholder="http://" value={fields.url} onChange={(e) => setFields({ ...fields, url: e.target.value })} />
                </FormGroup>
              </Col>
              <Col sm="12">
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

export default ModalBanners

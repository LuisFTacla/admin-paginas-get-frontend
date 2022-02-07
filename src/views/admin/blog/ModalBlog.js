import { useState, useEffect } from "react"
import { Button, Card, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import Select from "react-select"
import api from "../../../services/api"
import { toast } from "react-toastify"
import Uppy from "@uppy/core"
import axios from "axios"
import repo from "../../../services/files"
import { DragDrop } from "@uppy/react"
import { ThumbnailGenerator } from "uppy"
//import FileUploaderBasic from "../FileUploaderBasic"

const ModalBlog = (props) => {
  const url = "/blog"
  const { isOpen, dataToEdit, handleToggle, handleUpdate, blog, page, labelPage, category, labelCategory } = props
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState()

  const [file, setFile] = useState(null)
  const [img, setImg] = useState(null)

  const [selectBlog, setSelectBlog] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])

  const [items, setItems] = useState([])

  const config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }

  //  const [userData, setUserData] = useState(null)

  //ATRIBUIÇÃO DE VALORES INICIAIS PARA OS CAMPOS DA TABELA
  const initialStateFields = {
    pagina: page,
    categoria: "",
    titulo: "",
    cabecalho: "",
    texto: "",
    imagem: "",
    status: 2
  }
  const [fields, setFields] = useState(initialStateFields)

  //UPLOAD DE ARQUIVOS - NÃO FUNCIONAL
  const uppy = new Uppy({
    meta: { type: "avatar " },
    restrictions: { maxNumberOfFiles: 1 },
    autoProceed: true
  })

  uppy.use(ThumbnailGenerator)

  uppy.on("thumbnail:generated", (file, preview) => {
    setImg(preview)
    setFile(file)
    console.log(file)
  })

  const FileUploaderBasic = () => {
    return (
      <Card className="text-center">
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
        {img !== null ? <img className="rounded mt-2" src={img} alt="avatar" /> : null}
      </Card>
    )
  }
  /*
  useEffect(() => {
    const select = blog.map((blog) => ({ value: blog.id, label: blog.titulo }))
    setSelectBlog(select)
  }, [isOpen])
*/

  //FUNÇÃO QUE ENVIA UM GET À API, RETORNANDO LISTA DE CATEGORIAS PARA SELETOR
  useEffect(async () => {
    try {
      const { data } = await api.get(`categoriasPagina/${page}`)
      setCategoryOptions(data)
    } catch (error) {
      toast.error("Ocorreu um erro ao buscar categorias")
      console.log(error)
    }
    setReload(false)
  }, [reload])

  //ATRIBUIÇÃO DE VALORES OBTIDOS NO MODAL PARA ENVIAR À BASE DE DADOS
  useEffect(() => {
    if (!isOpen) return
    if (Object.keys(dataToEdit).length === 0) return setFields(initialStateFields)

    setFields({
      id: dataToEdit.id,
      pagina: dataToEdit.pagina,
      categoria: dataToEdit.categoria,
      titulo: dataToEdit.titulo,
      cabecalho: dataToEdit.cabecalho,
      texto: dataToEdit.texto,
      //      imagem: dataToEdit.imagem,
      //      data: dataToEdit.data,
      status: dataToEdit.status
    })

    if (dataToEdit.imagem !== "") {
      setImg(dataToEdit.imagem)
    }
  }, [dataToEdit])

  //CRIAÇÃO DE FORMDATA PARA ENVIAR À BASE DE DADOS - NÃO FUNCIONAL
  function createFormData() {
    const formData = new FormData()
    formData.append("id", fields.id)
    formData.append("pagina", fields.pagina)
    formData.append("categoria", fields.categoria)
    formData.append("titulo", fields.titulo)
    formData.append("cabecalho", fields.cabecalho)
    formData.append("texto", fields.texto)
    formData.append("status", fields.status)

    if (file !== null) {
      formData.append("imagem", file.data)
    }
    return formData
  }

  //FUNÇÃO PARA ENVIAR UM POST À API - CRIAÇÃO DE NOTÍCIA
  async function create() {
    const formData = createFormData()
    console.log(formData)
    await api
      .post("blog", fields) //MUDAR fields PARA formData POSTERIORMENTE
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

  //FUNÇÃO PARA ENVIAR UM PATCH À API - ATUALIZAÇÃO DE NOTÍCIA
  async function update() {
    const formData = createFormData()
    console.log(fields)
    await api
      .patch(`blog/${fields.id}`, fields) //MUDAR fields PARA formData POSTERIORMENTE
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
    if (dataToEdit.id) {
      await update()
    } else {
      await create()
    }
  }

  //ARRAY DE OPÇÕES DE CATEGORIAS
  const blogsCategoryOptions = [...categoryOptions.map((categoria) => ({ value: categoria.id, label: categoria.nome }))]

  //ARRAY DE OPÇÕES DE STATUS
  const blogsStatusOptions = [
    { value: 1, label: "Publicado" },
    { value: 2, label: "Rascunho" },
    { value: 3, label: "Bloqueado" }
  ]

  //RENDERIZAÇÃO DO MODAL
  return (
    <div className="basic-modal">
      <Modal className="modal-lg" isOpen={isOpen} toggle={handleToggle}>
        <Form className="w-100" onSubmit={handleSubmit} encType="multipart/form-data">
          <ModalHeader toggle={handleToggle}>{dataToEdit && dataToEdit.id ? "Editar postagem" : "Nova postagem"}</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label for="nameMulti">Título</Label>
                  <Input type="text" placeholder="Título" defaultValue={fields.titulo} onChange={(e) => setFields({ ...fields, titulo: e.target.value })} />
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <Label for="select-payment">Status</Label>
                  <Select
                    placeholder="Selecione"
                    className="react-select"
                    classNamePrefix="select"
                    options={blogsStatusOptions}
                    isClearable={false}
                    value={fields.status ? blogsStatusOptions.find((item) => item.value === fields.status) : ""}
                    onChange={(item) => setFields({ ...fields, status: item.value })}
                  />
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <Label for="select-payment">Categoria</Label>
                  <Select
                    placeholder="Selecione"
                    className="react-select"
                    classNamePrefix="select"
                    options={blogsCategoryOptions}
                    isClearable={false}
                    value={fields.categoria ? blogsCategoryOptions.find((item) => item.label === fields.categoria) : ""}
                    onChange={(item) => setFields({ ...fields, categoria: item.label })}
                  />
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="nameMulti">Cabeçalho</Label>
                  <Input type="text" placeholder="Cabeçalho" defaultValue={fields.cabecalho} onChange={(e) => setFields({ ...fields, cabecalho: e.target.value })} />
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="nameMulti">Texto</Label>
                  <Input type="textarea" placeholder="Texto" defaultValue={fields.texto} onChange={(e) => setFields({ ...fields, texto: e.target.value })} />
                </FormGroup>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col sm="12">
                <FormGroup>
                  <Label for="select-payment">Arquivo JPG ou PNG </Label>
                  {<FileUploaderBasic />}
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
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

export default ModalBlog

import { useState } from "react"
import Uppy from "@uppy/core"
import thumbnailGenerator from "@uppy/thumbnail-generator"
import { Card } from "reactstrap"
import { DragDrop } from "@uppy/react"

const FileUploaderBasic = (data) => {
  const [img, setImg] = useState(null)
  const [file, setFile] = useState(null)

  const uppy = new Uppy({
    meta: { type: "avatar" },
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

export default FileUploaderBasic
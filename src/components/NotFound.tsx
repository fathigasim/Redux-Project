
import { Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
const NotFound = () => {
    const {t}=useTranslation("common");
  return (
    <div style={{maxWidth:'30rem',display:'flex',gap:'2rem',flexDirection:'row',marginTop:'10rem',marginLeft:'auto',marginRight:'auto'}}>
        <Alert style={{flex:1,justifyContent:'center'}}><h3>{t("Page_not_found")}</h3></Alert>
    </div>
  )
}

export default NotFound

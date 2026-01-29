import React from 'react'
import { Button, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Product } from '../features/productSlice';

import { useDispatch } from 'react-redux';
import { type AppDispatch } from '../app/store';
import { basketInput, addToBasket,GetBasket } from '../features/basketSlice';
import { toast } from 'react-toastify';
import { BsCartPlus } from 'react-icons/bs';
const ProductCart = ({ product }: { product: Product }) => {
  const { t, i18n } = useTranslation("product");
  const dispatch = useDispatch<AppDispatch>();
   const  handleAddToCart = async (basket: basketInput) => { 
    try{
   await dispatch(addToBasket({prodId:basket.prodId,inputQnt:1})).unwrap();
     await  dispatch(GetBasket()).unwrap();
   toast.success("Product added to cart");
    }
    catch(err :any){
      console.log(`some error ${err}`)
      if(err.response.status===400)
      alert(err.response.data)
      toast.error(err.response.data)
    }
  };
 
  return (
    
    <Card  className=".image-container img-thumbnail card-img-top mt-2" style={{objectFit:"cover",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
      <Card.Img 
        variant="top" 
        src={product.imageUrl} 
        alt={product.name}  // ✅ Accessibility
        className="product-image"
        style={{height:"10rem",objectFit:"cover"}}
      />
      <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              <Card.Footer style={{margin:'0.5rem',display:"flex",flexShrink:"1",height:"2rem",flexWrap:"wrap"}}><span>
                            <strong>{t("Price")}:</strong>{" "}
                            {new Intl.NumberFormat(i18n.language, {
                              style: "currency",
                              currency: "SAR",
                            }).format(product.price)}
                          </span></Card.Footer>
             
            </Card.Body>
             <Button variant="primary"  className="mt-2 amiri-bold" onClick={()=>handleAddToCart({prodId:product.id,inputQnt:1})}><span>{t("addToCart")} <BsCartPlus size="1.5em" /></span></Button>
      {/* ... */}
    </Card>
    
  );
};

export default ProductCart

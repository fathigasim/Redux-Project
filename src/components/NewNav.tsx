
import './newnav.css';
const NewNav = () => {
  return (
    
<div className="mix">
<nav className="navbar navbar-inverse">
  <div className="container-fluid">
    <div className="navbar-header menuitem">
      <a className="navbar-brand" href="#">WebSiteName</a>
    </div>
    <div>
      <ul className="nav navbar-nav">
        <li className="active"><a href="#">Home</a></li>
        <li><a href="#">Menu Item 1</a></li>
        <li><a href="#">Menu Item 2</a></li>
        <li><a href="#">Menu Item 3</a></li>
      </ul>
    </div>
    <div>  <ul className="nav navbar-nav navbar-right">
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"> <span className="fa fa-gift bigicon"></span> 4 - Items in Cart<span className="caret"></span></a>
          <ul className="dropdown-menu dropdown-cart" role="menu">
              <li>
                  <span className="item">
                    <span className="item-left">
                        <img src="http://www.prepbootstrap.com/Content/images/template/menucartdropdown/item_1.jpg" alt="" />
                        <span className="item-info">
                            <span>Item name</span>
                            <span>price: 27$</span>
                        </span>
                    </span>
                    <span className="item-right">
                        <button className="btn btn-danger  fa fa-close"></button>
                    </span>
                </span>
              </li>
<li>
                  <span className="item">
                    <span className="item-left">
                        <img src="http://www.prepbootstrap.com/Content/images/template/menucartdropdown/item_2.jpg" alt="" />
                        <span className="item-info">
                            <span>Item name</span>
                            <span>price: 3$</span>
                        </span>
                    </span>
                    <span className="item-right">
                        <button className="btn btn-danger  fa fa-close"></button>
                    </span>
                </span>
              </li>
                            <li>
                  <span className="item">
                    <span className="item-left">
                        <img src="http://www.prepbootstrap.com/Content/images/template/menucartdropdown/item_3.jpeg" alt="" />
                        <span className="item-info">
                            <span>Item name</span>
                            <span>price: 12$</span>
                        </span>
                    </span>
                    <span className="item-right">
                        <button className="btn btn-danger  fa fa-close"></button>
                    </span>
                </span>
              </li>
<li>
                  <span className="item">
                    <span className="item-left">
                        <img src="http://www.prepbootstrap.com/Content/images/template/menucartdropdown/item_4.jpg" alt="" />
                        <span className="item-info">
                            <span>Item name</span>
                            <span>price: 7$</span>
                        </span>
                    </span>
                    <span className="item-right">
                        <button className="btn btn-danger  fa fa-close"></button>
                    </span>
                </span>
              </li>              
              <li className="divider"></li>
              <li><a className="text-center" href="#">View Cart</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
</div>

  )
}

export default NewNav

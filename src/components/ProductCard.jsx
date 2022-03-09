const ProductCard = (props) => {

    return (
        <div className="product-grid-item" data-testid="product-card" style={{ height: 'fit-content', backgroundColor: '#282c35', border: "2px solid #576072", borderRadius: '0.5rem', boxShadow: "2px 2px 7px #1d2026" }}>
            <div className="product-card-container">
                <div className="product-card-image">
                    <img style={{ margin: "auto" }} src={"https://picsum.photos/100"} alt={props.product} />
                </div>
                <div className="product-card-heading" style={{ padding: "0 0.2rem 0 1rem", display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "space-evenly", textAlign: "left" }}>
                    <h4 style={{ margin: 0, fontSize: "clamp(1rem, -0.8750rem + 8.3333vw, 1.5rem)" }}>
                        {props.product}
                    </h4>
                    <h6>
                        {props.flavour}
                    </h6>
                </div>
                <div className="product-card-description">
                    <h6 style={{ margin: 0, fontSize: "calc(1rem + 0.2vw)" }}>
                        Samples requested: {props.count}
                    </h6>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;

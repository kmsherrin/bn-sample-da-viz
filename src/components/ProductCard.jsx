import { motion } from "framer-motion";

const ProductCard = (props) => {

    return (
        <motion.div 
            layout 
            animate={{ opacity: 1, scale: 1 }} 
            initial={{opacity: 0, scale: 0}} 
            exit={{opacity: 0, scale: 0}}
            className="product-grid-item border-style" 
            data-testid="product-card" 
            style={{ height: 'fit-content', backgroundColor: '#282c35'}}>

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
        </motion.div>
    )
}

export default ProductCard;

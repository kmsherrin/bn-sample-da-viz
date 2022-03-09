const FilterOptions = (props) => {

    return (
        <div name="product-filter-checkboxes" style={{ textAlign: "left" }}>
            {
                props.inputArray.sort().map((row, index) => {
                    return (
                        <div style={{ margin: "0.5rem", display: "flex" }} key={index} data-testid={props.testid}>
                            <input id={`product-checkbox-${row}`} type="checkbox" value={row} onChange={(e) => props.checkboxHandler(e)} />
                            <label className="filter-label" htmlFor={`product-checkbox-${row}`}>{row}</label>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default FilterOptions;

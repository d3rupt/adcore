import React, {useEffect, useState} from 'react';
import {ExpandMore} from '@material-ui/icons';
import axios from 'axios'

function AccordionChild({id, name, description, parent, read_only, children}) {
    const [readOnly, setReadOnly] = useState(0)

    const changeName = () => {
        let input = document.getElementById(id);
        axios.post('/update_node', {id: id, name: name}).then(res => {
            alert('ID: ' + res)
        })
    }
    useEffect(() => {
        setReadOnly(parseInt(read_only));
        console.log(name)
    }, [])

    return (
        <div className='data-accordion flex' style={{marginLeft: '5rem'}}>
            <div className='accordion-title flex'>
                <h3>{id} - {!readOnly ? 'Read Only' : null}</h3>
                <ExpandMore />
            </div>
            <div className='accordion-data flex'>
                <div className='acc-dataContainer flex'>
                    <div className='acc-dataInner flex'>
                        <div className='acc-data flex'>
                            <p>NAME: </p>
                            {readOnly ? <input  id={id} placeholder={name}/> : <p>{name}</p>}
                            {readOnly ? <div id={id} className='edit-button button flex' onClick={changeName}>
                                <p>CHANGE NAME</p>
                            </div> : null}
                        </div>
                        <div className='acc-data flex'>
                            <p>DESCRIPTION: </p>
                            <p>{description}</p>
                        </div>
                    </div>
                    {children.map(child => {
                        return (
                            <AccordionChild
                                id={child.id}
                                name={child.name}
                                description={child.description}
                                read_only={child.read_only}
                                children={child.children}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default AccordionChild;

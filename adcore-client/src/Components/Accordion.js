import React, {useEffect, useState} from 'react';
import {ExpandMore} from '@material-ui/icons';
import AccordionChild from './AccordionChild';
import axios from 'axios';

function Accordion({id, name, description, parent, read_only, children}) {
    const [readOnly, setReadOnly] = useState(0)

    const changeName = () => {
        let input = document.getElementById(id);
        axios.post('/update_node', {id: id, name: name}).then(res => {
            alert('ID: ' + res)
        })
    }

    const delNode = () => {
        axios.get('/delete_node', {id: id}).then(res => {
            alert('ID: ' + res);
        })
    }
    useEffect(() => {
        //console.log(children)
        setReadOnly(parseInt(read_only));
        /*let datas = document.querySelectorAll('.acc-data');
        datas.forEach(data => {
            data.style.height = document.querySelector('.accordion-data').scrollHeight + 'px'
        })*/
    }, [])

    return (
        <div className='data-accordion flex'>
            <div className='accordion-title flex'>
                <h3>{id} - {!readOnly ? 'Read Only' : null}</h3>
                <ExpandMore />
            </div>
            <div className='acc-dataContainer flex'>
                <div className='acc-dataInner flex'>
                    <div className='acc-data flex'>
                        <p>NAME: </p>
                        {readOnly ? <input placeholder={name}/> : <p>{name}</p>}
                        {readOnly ? <div className='edit-button button flex'>
                            <p>CHANGE NAME</p>
                        </div> : null}
                    </div>
                    <div className='acc-data flex'>
                        <p>DESCRIPTION: </p>
                        <p>{description}</p>
                    </div>
                    <div className='acc-data flex'>

                    </div>
                    <div id={id+'-del'} className='button del-button' onClick={delNode}>
                        <p>DELETE NODE</p>
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
    );
}

export default Accordion;

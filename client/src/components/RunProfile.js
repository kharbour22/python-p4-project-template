import { useState, useEffect } from "react";
import {useParams, useOutletContext, useNavigate} from "react-router-dom";

function RunProfile(){

    const [run, setRun] = useState(null)
    const [displayForm, setDisplayForm] = useState(false)
    const [formData, setFormData] = useState({
        location: "",
        image: "",
        link: ""
    })

    // id - contains a number that refers to the id for the hotel that should be retrieved via fetch() (GET request) in the callback function in useEffect().
    const {id} = useParams()

    const {deleteRun, updateRun} = useOutletContext()
    const navigate = useNavigate()

    useEffect(() => {
        
        fetch(`/runs/${id}`)
        .then(response => {
            if(response.ok){
                response.json().then(runData => {
                    setRun(runData)
                    setFormData({
                        location: runData.location,
                        image: runData.image,
                        link: runData.link
                    })
                })
            }
            else if(response.status === 404){
                response.json().then(errorData => alert(`Error: ${errorData.error}`))
            }
            else{
                response.json().then(() => alert("Error: Something went wrong."))
            }
        })
    }, [])

    function handleDeleteButtonClick(){
        deleteRun(run.id)
        setRun(null)
        navigate('/')
    }

    function toggleDisplayForm(){
        setDisplayForm(displayForm => !displayForm)
    }

    function handleSubmit(event){
        event.preventDefault()

        updateRun(run.id, formData, setRun)
        // setRun({...run, ...formData})

        toggleDisplayForm()
    }

    function updateFormData(event){
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    return (
        <>
            {run ?
            <div className="run-profile">
                <img src={run.image} alt={run.location}/>
                <h4>{run.name}</h4>
                { !displayForm ?
                <div className="button-div">
                    <button onClick={toggleDisplayForm} className="update-button">Update Run</button>
                    <button onClick={handleDeleteButtonClick} className="delete-button">Delete Run</button>
                </div> :
                <form onSubmit={handleSubmit} className="edit-run">
                    <input onChange={updateFormData} type="text" name="location" placeholder="Run name" value={formData.location} />
                    <input onChange={updateFormData} type="text" name="image" placeholder="Image URL" value={formData.image} />
                    <input onChange={updateFormData} type="text" name="link" placeholder="URL link" value={formData.link} />
                    <button type="submit">Save Changes</button>
                </form>
                }
            </div> :
            null
            }
        </>
    );
}

export default RunProfile;
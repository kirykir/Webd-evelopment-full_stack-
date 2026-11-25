import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PostForm from '../components/PostForm.jsx'

function EditPostPage() {
const { id } = useParams()
const navigate = useNavigate()

const [post, setPost] = useState(null)
const [loading, setLoading] = useState(true)
const [submitting, setSubmitting] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
async function fetchPost() {
try {
setLoading(true)
setError(null)

    const response = await fetch(`/api/posts/${id}`)

    if (!response.ok) {
      throw new Error('Failed to load post')
    }

    const data = await response.json()
    setPost(data)
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

fetchPost()

}, [id])

async function handleSubmit(e) {
e.preventDefault()
setSubmitting(true)
setError(null)

const formData = new FormData(e.target)

const updatedPost = {
  title: formData.get('title'),
  author: formData.get('author'),
  content: formData.get('content')
}

try {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedPost)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update post')
  }

  navigate(`/posts/${id}`)
} catch (err) {
  setError(err.message)
} finally {
  setSubmitting(false)
}

}

if (loading) return <p className="status-msg">Loading…</p>
if (error && !post) return <p className="status-msg error">{error}</p>
if (!post) return <p className="status-msg">Post not found.</p>

return (
<div>
<h1 className="page-title">Edit post</h1>
{error && <p className="status-msg error">{error}</p>}
<PostForm
     key={post._id}
     initialData={post}
     onSubmit={handleSubmit}
     submitting={submitting}
   />
</div>
)
}

export default EditPostPage
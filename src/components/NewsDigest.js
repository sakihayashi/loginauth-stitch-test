import React from 'react'
import { Link } from 'gatsby'

const NewsDigest = (props) => {
    const { excerpt, frontmatter, id, internal, fields } = props.node;
    const wordsPerMinute = 500; // Average case.
    let minRead
    let textLength = internal.content.length
        minRead = Math.round(textLength / wordsPerMinute)
    let randomNumber = Math.floor((Math.random() * 50) + 1);
    return (
        <React.Fragment>
            <li className="post-list-item" key={randomNumber}>
                <Link to={fields.slug}><img className="post-list-img" src={frontmatter.featuredImage} />
                    <div className="post-list-text"><strong>{frontmatter.title}</strong></div>
                    <div className="post-list-text font-kokoro">{frontmatter.categories[0].category}{' | '}{minRead}{' '}min{' '}read{' | '}{frontmatter.date}</div>
                    <div className="post-list-desc">{excerpt}</div>
                </Link>
          </li>
        </React.Fragment>
    )
}


export default NewsDigest
import React, {useRef, useEffect} from "react"
import { Link, graphql } from "gatsby"

import FullLayout from "../components/full_layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import radar_visualization from "../components/radar"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges
  const svgRef = useRef(null);
  
  useEffect(() => {
    radar_visualization(svgRef.current, {
      width: 1450,
      height: 1000,
      colors: {
        background: "#fff",
        grid: "#bbb",
        inactive: "#ddd"
      },
      quadrants: [
        { name: "Languages" },
        { name: "Infrastructure" },
        { name: "Frameworks" },
        { name: "Data Management" }
      ],
      rings: [
        { name: "ADOPT",  color: "#93c47d" },
        { name: "TRIAL", color: "#b7e1cd" },
        { name: "ASSESS",  color: "#fce8b2" },
        { name: "HOLD",  color: "#f4c7c3" }
      ],
      print_layout: true,
      entries: posts.map(({ node }) => {
        var quadrant = 0;
        var ring = 0;
        var moved = 0;
        if(node.frontmatter.moved === 'up')
          moved = 1;
        else if(node.frontmatter.moved === 'down')
          moved = -1;
        
        if(node.frontmatter.quadrant === 'infrastructure')
          quadrant = 1;
        else if(node.frontmatter.quadrant === 'language')
          quadrant = 0;
        else if(node.frontmatter.quadrant === 'data_management')
          quadrant = 3;
        else if(node.frontmatter.quadrant === 'framework')
          quadrant = 2;
        
        if(node.frontmatter.ring === 'adopt')
          ring = 0;
        else if(node.frontmatter.ring === 'trial')
          ring = 1;
        else if(node.frontmatter.ring === 'assess')
          ring = 2;
        else if(node.frontmatter.ring === 'hold')
          ring = 3;
        
        return {
          label: node.frontmatter.title || node.fields.slug,
          quadrant: quadrant,
          ring: ring,
          moved: moved,
          active: true,
          link: node.fields.slug
        }
      })
    });
  })


  return (
    <FullLayout location={location} title={siteTitle}>
      <SEO title="Tech Radar" />
      <svg ref={svgRef}></svg>
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        return (
          <article key={node.fields.slug}>
            <header>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <pill></pill>
              <small>{node.frontmatter.date}</small>
            </header>
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </section>
          </article>
        )
      })}
    </FullLayout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
{
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}, filter: {frontmatter: {type: {eq: "tech"}}}) {
    edges {
      node {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          type
          ring
          quadrant
          moved
        }
      }
    }
  }
}
`

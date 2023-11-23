import React, { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { useNotes } from "../contexts/NotesContext";
import { useNavigate } from "react-router-dom";

function generateUUID(): string {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

type Tag = {
  label: string;
  value: string | number;
};

export default function CreateNote() {
  const { addnote } = useNotes();

  const [tags, settags] = useState<Tag[]>([]);

  const markdownref = useRef<HTMLTextAreaElement>(null);
  const titleref = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    return;
  }

  function createNote() {
    addnote({
      title: titleref.current?.value || "Default name",
      tags: tags,
      markdown: markdownref.current?.value || "",
      id: generateUUID(),
    });
    navigate("/");
  }

  return (
    <>
      <Container className="mt-3">
        <Row>
          <Col md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="noteTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  ref={titleref}
                  type="text"
                  placeholder="Note Title"
                  defaultValue={""}
                />
              </Form.Group>
              <Form.Group controlId="noteTags">
                <Form.Label>Tags</Form.Label>
                <CreatableSelect
                  isMulti
                  options={tags}
                  onCreateOption={(label: string) => {
                    settags((prev) => {
                      return [...prev, { label: label, value: label }];
                    });
                  }}
                  onChange={(tags) => {
                    settags(
                      tags.map((elem) => {
                        return { ...elem };
                      })
                    );
                  }}
                  value={tags}
                />
              </Form.Group>
              <Form.Group controlId="noteContent">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  defaultValue={""}
                  ref={markdownref}
                  rows={15}
                />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Link to="/">
                  <Button variant="danger">Cancel</Button>
                </Link>
                <Button variant="primary" onClick={createNote}>
                  Create
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

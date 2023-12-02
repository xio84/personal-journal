'use client'

import { Button, TextInput, Textarea, Text } from "@tremor/react"
import { useFormState, useFormStatus } from "react-dom"
import { setEntry } from "./actions"

const initState = {
    message: '',
  }

export function EntryForm() {
    const { pending } = useFormStatus()
    const [ state, formAction ] = useFormState(setEntry, initState)
    return (

      <form action={formAction}>
        <TextInput id="title" name="title" className='mb-4' placeholder='Title...'/>
        <Textarea id="journal" name="journal" className='mb-4' placeholder='Journal...'/>
        <Button className='mb-4' type='submit' disabled={pending}>Submit</Button>
        <Text>
            {state?.message}
        </Text>
    </form>
    )
}
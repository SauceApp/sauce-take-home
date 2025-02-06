import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { createFeedbackMutation } from '../api';

interface IFeedbackFromProps {
    onClose:()=>void;
    onSuccess:() => void;
}

interface IFeedbackFormData {
    feedbacks: {
        text: string;
    }[];
}

const AddFeedbackForm: React.FC<IFeedbackFromProps> = ({onClose,onSuccess}) => {
    const form = useForm<IFeedbackFormData>({
        defaultValues:{feedbacks:[{text:''}]}
    })

    const {fields, append, remove} = useFieldArray({
        control:form.control,
        name:'feedbacks'
    })

    const onSubmit = async (data:IFeedbackFormData) => {
    try {
      const validFeedbacks = data.feedbacks.filter(f => f.text.trim());
      if (validFeedbacks.length === 0) return;

      await Promise.all(validFeedbacks.map(f => createFeedbackMutation(f.text)));
      form.reset();
      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='modal-overlay'>
        <div className='modal-container'>
            <div className='flex justify-between mb-6'>
                <h2 className='font-bold text-xl text-gray-800'>Add Feedbacks</h2>
                <button className=' text-gray-500' onClick={onClose}>Close</button>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4' >
                <div className='overflow-y-auto space-y-4 max-h-[60vh]'>
                    {fields.map((field, index)=>(
                        <div key={field.id}>
                            <div className='flex justify-between'>
                                <label className='text-gray-500'>Feedback {index+1}</label>
                                {fields.length > 1 && (
                                    <button 
                                        className='btn-outline-sm' 
                                        onClick={() => remove(index)} type="button" >Remove</button>
                                )}
                            </div>
                            
                            <textarea 
                                {...form.register(`feedbacks.${index}.text`)}
                                placeholder='Enter your feedback'
                                className='w-full textarea-base'
                                rows={3}

                            />
                        </div>
                    ))}
                </div>
                <button 
                    type='button'
                    className='btn-dashed' 
                    onClick={()=>append({text:''})} >
                            + Add More Feedback
                </button>
                
                <button
                    type="submit"
                    className="btn-primary w-full mt-6"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                
            </form>
            
            
        </div>
        
    </div>
  )
}

export default AddFeedbackForm
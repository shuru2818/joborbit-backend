//match score find

exports.calculateMatchScore = (jobskills , resumeText) => {
    if(!jobskills || jobskills.length == 0) return 0;

    const text = resumeText.toLowerCase();
    let matchCount = 0;
     
    jobskills.forEach(skill =>{
        if(text.includes(skill.toLowerCase())){
            matchCount++;
        }
    })

    const score = (matchCount / jobskills.length) * 100;
    return Math.round(score);
}


//get missing values (jobskills - resumeskills)

exports.getMissingSkills = (jobskills, resumeskills)=>{
    if(!jobskills || !resumeskills ) return 0;

    const missing = jobskills.filter(skill=>
        !resumeskills.includes(skill)
    )
    return missing;
}

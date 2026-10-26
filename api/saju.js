export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'POST 요청만 지원합니다.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const { birthData } = req.body;

    if (!apiKey) {
        return res.status(500).json({ error: 'API 키가 설정되지 않았습니다. Vercel 환경 변수를 확인하세요.' });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `사용자의 생년월일시(${birthData})를 바탕으로 명리학 기준의 사주풀이를 아주 자세히, 신비롭고 긍정적인 말투로 설명해 줘.` }] 
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ error: 'API 호출 오류: ' + data.error.message });
        }

        const resultText = data.candidates[0].content.parts[0].text;
        res.status(200).json({ result: resultText });

    } catch (error) {
        res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
    }
}

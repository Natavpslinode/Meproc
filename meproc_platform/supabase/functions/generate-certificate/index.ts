Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { userId, studentName } = await req.json();

        if (!userId || !studentName) {
            throw new Error('User ID and student name are required');
        }

        // Get the service role key and URL
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Verify the user has completed all modules
        const progressResponse = await fetch(`${supabaseUrl}/rest/v1/student_progress?user_id=eq.${userId}&is_completed=eq.true&select=*`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!progressResponse.ok) {
            throw new Error('Error checking student progress');
        }

        const progressData = await progressResponse.json();

        if (progressData.length < 10) {
            throw new Error('Student has not completed all modules');
        }

        // Get current date for certificate
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        // Generate certificate HTML with exact Spanish content
        const certificateHTML = `
        <div style="
            width: 800px;
            height: 600px;
            border: 10px solid #1E3A8A;
            background: linear-gradient(135deg, #FFB57C 0%, #FFFFFF 50%, #FFB57C 100%);
            padding: 40px;
            font-family: 'Times New Roman', serif;
            text-align: center;
            position: relative;
            margin: 0 auto;
            box-sizing: border-box;
        ">
            <!-- Logo SVG -->
            <div style="margin-bottom: 20px;">
                <svg width="80" height="80" viewBox="0 0 200 200" style="margin: 0 auto;">
                    <defs>
                        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#1E3A8A;stop-opacity:1" />
                            <stop offset="50%" style="stop-color:#3B82F6;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r="90" fill="url(#logoGrad)" stroke="#1E3A8A" stroke-width="4"/>
                    <text x="100" y="80" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="white">MEPROC</text>
                    <path d="M60 120 Q100 140 140 120" stroke="white" stroke-width="3" fill="none"/>
                    <circle cx="80" cy="130" r="8" fill="white"/>
                    <circle cx="120" cy="130" r="8" fill="white"/>
                    <rect x="75" y="140" width="50" height="20" rx="10" fill="white"/>
                    <text x="100" y="153" font-family="Arial, sans-serif" font-size="8" font-weight="bold" text-anchor="middle" fill="#1E3A8A">EDUCACIÓN</text>
                </svg>
            </div>

            <h1 style="
                color: #1E3A8A;
                font-size: 36px;
                font-weight: bold;
                margin: 20px 0;
                letter-spacing: 2px;
                text-transform: uppercase;
            ">CERTIFICADO DE FINALIZACIÓN</h1>

            <div style="margin: 30px 0; line-height: 1.6;">
                <p style="font-size: 18px; color: #1E3A8A; margin: 10px 0;">Certificamos que</p>
                
                <h2 style="
                    font-size: 28px;
                    color: #1E3A8A;
                    margin: 20px 0;
                    font-weight: bold;
                    text-decoration: underline;
                ">${studentName}</h2>
                
                <p style="font-size: 18px; color: #1E3A8A; margin: 10px 0;">ha completado exitosamente el</p>
                
                <h2 style="
                    font-size: 24px;
                    color: #1E3A8A;
                    margin: 20px 0;
                    font-weight: bold;
                    text-transform: uppercase;
                ">CURSO VIRTUAL Y PRÁCTICO DE REPARACIÓN DE CELULARES</h2>
                
                <p style="font-size: 16px; color: #1E3A8A; margin: 15px 0;">
                    con una duración de 40 horas académicas, completado en el año 2025.
                </p>
                
                <p style="font-size: 16px; color: #1E3A8A; margin: 15px 0; font-style: italic;">
                    Agradecemos su dedicación y compromiso con el aprendizaje.
                </p>
            </div>

            <div style="
                position: absolute;
                bottom: 60px;
                left: 50%;
                transform: translateX(-50%);
                width: 600px;
            ">
                <p style="font-size: 14px; color: #1E3A8A; margin-bottom: 30px;">
                    Otorgado en la ciudad de [Ciudad], el ${formattedDate}
                </p>
                
                <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                    <div style="text-align: center; width: 250px;">
                        <div style="border-bottom: 2px solid #1E3A8A; margin-bottom: 10px; height: 1px;"></div>
                        <p style="font-size: 14px; color: #1E3A8A; font-weight: bold; margin: 0;">DIRECTOR</p>
                        <p style="font-size: 12px; color: #1E3A8A; margin: 5px 0 0 0;">Ministerio Educativo de Profesionales Cristianos</p>
                    </div>
                    <div style="text-align: center; width: 250px;">
                        <div style="border-bottom: 2px solid #1E3A8A; margin-bottom: 10px; height: 1px;"></div>
                        <p style="font-size: 14px; color: #1E3A8A; font-weight: bold; margin: 0;">SECRETARIO</p>
                        <p style="font-size: 12px; color: #1E3A8A; margin: 5px 0 0 0;">Ministerio Educativo de Profesionales Cristianos</p>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Record certificate generation in database
        const certificateRecord = {
            user_id: userId,
            student_name: studentName,
            completion_date: currentDate.toISOString(),
            certificate_html: certificateHTML
        };

        const insertResponse = await fetch(`${supabaseUrl}/rest/v1/student_certificates`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(certificateRecord)
        });

        if (!insertResponse.ok) {
            console.log('Warning: Could not save certificate record to database');
        }

        return new Response(JSON.stringify({
            data: {
                certificateHTML,
                studentName,
                completionDate: formattedDate
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Certificate generation error:', error);

        const errorResponse = {
            error: {
                code: 'CERTIFICATE_GENERATION_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
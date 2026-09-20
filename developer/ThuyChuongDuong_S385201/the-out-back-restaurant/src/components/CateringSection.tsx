import React, { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import cateringImage from "../imports/optimized/catering.webp";

const DialogRoot = Dialog.Root;
const DialogTrigger = Dialog.Trigger;
const DialogPortal = Dialog.Portal;
const DialogBackdrop = Dialog.Backdrop;
const DialogPopup = Dialog.Popup;
const DialogClose = Dialog.Close;
const DialogTitle = Dialog.Title;
const DialogDescription = Dialog.Description;
const emptyForm = {
    name: "",
    email: "",
    phone: "",
    date: "",
    headcount: "",
    budget: "",
    message: "",
};

export default function CateringSection() {
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [website, setWebsite] = useState("");
    const [form, setForm] = useState(emptyForm);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitError("");
        setSubmitting(true);

        try {
            const response = await fetch("/api/catering-enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, website }),
            });
            const result = await response.json();
            if (!response.ok || result.ok !== true) throw new Error("Email delivery failed");

            setForm(emptyForm);
            setWebsite("");
            setSubmitted(true);
        } catch {
            setSubmitError("We couldn't send your enquiry. Please try again or call us on 0435 337 006.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section
            id="catering"
            style={{
                backgroundColor: "#E07828",
                padding: "96px 48px",
                position: "relative",
                overflow: "hidden",
                scrollMarginTop: 82,
            }}
            className="catering-section"
        >
            {/* Large decorative text */}
            <div
                style={{
                    position: "absolute",
                    top: -24,
                    right: -16,
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(80px, 14vw, 200px)",
                    color: "rgba(0,63,88,0.08)",
                    lineHeight: 1,
                    userSelect: "none",
                    pointerEvents: "none",
                    letterSpacing: "-0.02em",
                    whiteSpace: "nowrap",
                }}
            >
                CATERING
            </div>

            <div
                style={{
                    maxWidth: 1440,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 64,
                    alignItems: "center",
                    position: "relative",
                    zIndex: 1,
                }}
                className="catering-grid"
            >
                {/* Left: Copy */}
                <div>
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: 600,
                            fontSize: 12,
                            letterSpacing: "0.12em",
                            color: "#003F58",
                            opacity: 0.7,
                            marginBottom: 16,
                        }}
                    >
                        FOR WORK, EVENTS & GATHERINGS
                    </p>
                    <h2
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(48px, 6vw, 88px)",
                            lineHeight: 0.92,
                            color: "#003F58",
                            margin: "0 0 24px",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        FEED
                        <br />
                        THE
                        <br />
                        CREW
                    </h2>
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 18,
                            lineHeight: 1.65,
                            color: "#003F58",
                            opacity: 0.8,
                            marginBottom: 36,
                            maxWidth: 400,
                        }}
                    >
                        Easy catering for work, events and gatherings. Banh mi
                        platters, noodle salad boxes, rice paper rolls and more
                        — fresh, generous, and always crowd-pleasing.
                    </p>

                    {/* Features */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                            marginBottom: 40,
                        }}
                    >
                        {[
                            "Banh Mi, noodles, rolls, sides",
                            "Office, events & private functions",
                            "Please contact us at least 48 hours ahead if possible",
                        ].map((item) => (
                            <div
                                key={item}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <div
                                    style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: "50%",
                                        backgroundColor: "#003F58",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <span
                                        style={{
                                            color: "#E07828",
                                            fontSize: 10,
                                            fontWeight: 700,
                                        }}
                                    >
                                        ✓
                                    </span>
                                </div>
                                <span
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: 15,
                                        color: "#003F58",
                                        fontWeight: 500,
                                    }}
                                >
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Dialog trigger */}
                    <DialogRoot>
                        <DialogTrigger
                            style={{
                                backgroundColor: "#003F58",
                                color: "#E07828",
                                fontFamily: "var(--font-display)",
                                fontSize: 14,
                                letterSpacing: "0.06em",
                                padding: "18px 36px",
                                borderRadius: 8,
                                border: "none",
                                cursor: "pointer",
                                transition:
                                    "background-color 180ms ease, transform 100ms ease",
                                display: "inline-block",
                            }}
                            onMouseEnter={(
                                e: React.MouseEvent<HTMLButtonElement>,
                            ) => {
                                e.currentTarget.style.backgroundColor =
                                    "#002A3A";
                                e.currentTarget.style.transform =
                                    "translateY(-2px)";
                            }}
                            onMouseLeave={(
                                e: React.MouseEvent<HTMLButtonElement>,
                            ) => {
                                e.currentTarget.style.backgroundColor =
                                    "#003F58";
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                            }}
                        >
                            CATERING ENQUIRY
                        </DialogTrigger>
                        <DialogPortal>
                            <DialogBackdrop className="dialog-backdrop" />
                            <DialogPopup className="dialog-popup">
                                {submitted ? (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            padding: "24px 0",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 64,
                                                height: 64,
                                                backgroundColor: "#E07828",
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                margin: "0 auto 20px",
                                                fontSize: 28,
                                            }}
                                        >
                                            ✓
                                        </div>
                                        <h3
                                            style={{
                                                fontFamily:
                                                    "var(--font-display)",
                                                fontSize: 28,
                                                color: "#003F58",
                                                margin: "0 0 12px",
                                            }}
                                        >
                                            ENQUIRY SENT!
                                        </h3>
                                        <p
                                            style={{
                                                color: "#555",
                                                fontSize: 15,
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            Your catering enquiry has been sent.
                                            We&apos;ll be in touch soon.
                                        </p>
                                        <DialogClose
                                            style={{
                                                marginTop: 24,
                                                backgroundColor: "#003F58",
                                                color: "#E07828",
                                                fontFamily:
                                                    "var(--font-display)",
                                                fontSize: 13,
                                                letterSpacing: "0.06em",
                                                padding: "12px 28px",
                                                borderRadius: 8,
                                                border: "none",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => setSubmitted(false)}
                                        >
                                            CLOSE
                                        </DialogClose>
                                    </div>
                                ) : (
                                    <>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                marginBottom: 24,
                                            }}
                                        >
                                            <div>
                                                <DialogTitle
                                                    style={{
                                                        fontFamily:
                                                            "var(--font-display)",
                                                        fontSize: 28,
                                                        color: "#003F58",
                                                        margin: 0,
                                                        lineHeight: 1.1,
                                                    }}
                                                >
                                                    CATERING
                                                    <br />
                                                    ENQUIRY
                                                </DialogTitle>
                                                <DialogDescription
                                                    style={{
                                                        fontFamily:
                                                            "var(--font-body)",
                                                        fontSize: 14,
                                                        color: "#666",
                                                        marginTop: 8,
                                                    }}
                                                >
                                                    Tell us about your event and
                                                    we'll be in touch.
                                                </DialogDescription>
                                            </div>
                                            <DialogClose
                                                style={{
                                                    background: "none",
                                                    border: "1px solid #ddd",
                                                    borderRadius: 6,
                                                    width: 32,
                                                    height: 32,
                                                    cursor: "pointer",
                                                    fontSize: 14,
                                                    color: "#666",
                                                    flexShrink: 0,
                                                }}
                                                aria-label="Close"
                                            >
                                                ✕
                                            </DialogClose>
                                        </div>

                                        <form
                                            onSubmit={handleSubmit}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 14,
                                            }}
                                        >
                                            {[
                                                {
                                                    key: "name",
                                                    label: "Your name",
                                                    type: "text",
                                                    required: true,
                                                    maxLength: 100,
                                                },
                                                {
                                                    key: "email",
                                                    label: "Email address",
                                                    type: "email",
                                                    required: true,
                                                    maxLength: 254,
                                                },
                                                {
                                                    key: "phone",
                                                    label: "Phone number",
                                                    type: "tel",
                                                    required: false,
                                                    maxLength: 50,
                                                },
                                            ].map(
                                                ({
                                                    key,
                                                    label,
                                                    type,
                                                    required,
                                                    maxLength,
                                                }) => (
                                                    <div key={key}>
                                                        <label
                                                            htmlFor={`catering-${key}`}
                                                            style={{
                                                                display:
                                                                    "block",
                                                                fontFamily:
                                                                    "var(--font-body)",
                                                                fontWeight: 600,
                                                                fontSize: 12,
                                                                letterSpacing:
                                                                    "0.06em",
                                                                color: "#003F58",
                                                                marginBottom: 6,
                                                            }}
                                                        >
                                                            {label.toUpperCase()}
                                                            {required && " *"}
                                                        </label>
                                                        <input
                                                            id={`catering-${key}`}
                                                            name={key}
                                                            type={type}
                                                            required={required}
                                                            maxLength={maxLength}
                                                            value={
                                                                form[
                                                                    key as keyof typeof form
                                                                ]
                                                            }
                                                            onChange={(e) =>
                                                                setForm(
                                                                    (f) => ({
                                                                        ...f,
                                                                        [key]: e
                                                                            .target
                                                                            .value,
                                                                    }),
                                                                )
                                                            }
                                                            style={{
                                                                width: "100%",
                                                                padding:
                                                                    "10px 14px",
                                                                borderRadius: 8,
                                                                border: "1.5px solid #ddd",
                                                                fontFamily:
                                                                    "var(--font-body)",
                                                                fontSize: 15,
                                                                color: "#171717",
                                                                outline: "none",
                                                                transition:
                                                                    "border-color 150ms ease",
                                                            }}
                                                            onFocus={(e) =>
                                                                (e.target.style.borderColor =
                                                                    "#11789D")
                                                            }
                                                            onBlur={(e) =>
                                                                (e.target.style.borderColor =
                                                                    "#ddd")
                                                            }
                                                        />
                                                    </div>
                                                ),
                                            )}

                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns:
                                                        "1fr 1fr",
                                                    gap: 14,
                                                }}
                                            >
                                                <div>
                                                    <label
                                                        htmlFor="catering-date"
                                                        style={{
                                                            display: "block",
                                                            fontFamily:
                                                                "var(--font-body)",
                                                            fontWeight: 600,
                                                            fontSize: 12,
                                                            letterSpacing:
                                                                "0.06em",
                                                            color: "#003F58",
                                                            marginBottom: 6,
                                                        }}
                                                    >
                                                        EVENT DATE
                                                    </label>
                                                    <input
                                                        id="catering-date"
                                                        type="date"
                                                        value={form.date}
                                                        onChange={(e) =>
                                                            setForm((f) => ({
                                                                ...f,
                                                                date: e.target
                                                                    .value,
                                                            }))
                                                        }
                                                        style={{
                                                            width: "100%",
                                                            padding:
                                                                "10px 14px",
                                                            borderRadius: 8,
                                                            border: "1.5px solid #ddd",
                                                            fontFamily:
                                                                "var(--font-body)",
                                                            fontSize: 15,
                                                            color: "#171717",
                                                            outline: "none",
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="catering-headcount"
                                                        style={{
                                                            display: "block",
                                                            fontFamily:
                                                                "var(--font-body)",
                                                            fontWeight: 600,
                                                            fontSize: 12,
                                                            letterSpacing:
                                                                "0.06em",
                                                            color: "#003F58",
                                                            marginBottom: 6,
                                                        }}
                                                    >
                                                        HEADCOUNT
                                                    </label>
                                                    <input
                                                        id="catering-headcount"
                                                        type="number"
                                                        min="1"
                                                        max="9999"
                                                        placeholder="e.g. 25"
                                                        value={form.headcount}
                                                        onChange={(e) =>
                                                            setForm((f) => ({
                                                                ...f,
                                                                headcount:
                                                                    e.target
                                                                        .value,
                                                            }))
                                                        }
                                                        style={{
                                                            width: "100%",
                                                            padding:
                                                                "10px 14px",
                                                            borderRadius: 8,
                                                            border: "1.5px solid #ddd",
                                                            fontFamily:
                                                                "var(--font-body)",
                                                            fontSize: 15,
                                                            color: "#171717",
                                                            outline: "none",
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="catering-budget"
                                                    style={{
                                                        display: "block",
                                                        fontFamily:
                                                            "var(--font-body)",
                                                        fontWeight: 600,
                                                        fontSize: 12,
                                                        letterSpacing: "0.06em",
                                                        color: "#003F58",
                                                        marginBottom: 6,
                                                    }}
                                                >
                                                    BUDGET (AUD) *
                                                </label>
                                                <select
                                                    id="catering-budget"
                                                    required
                                                    value={form.budget}
                                                    onChange={(e) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            budget: e.target
                                                                .value,
                                                        }))
                                                    }
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 14px",
                                                        borderRadius: 8,
                                                        border: "1.5px solid #ddd",
                                                        backgroundColor:
                                                            "#FFFFFF",
                                                        fontFamily:
                                                            "var(--font-body)",
                                                        fontSize: 15,
                                                        color: form.budget
                                                            ? "#171717"
                                                            : "#777",
                                                        outline: "none",
                                                    }}
                                                >
                                                    <option value="" disabled>
                                                        Select your budget
                                                    </option>
                                                    <option value="Under $250">
                                                        Under $250
                                                    </option>
                                                    <option value="$250 – $500">
                                                        $250 – $500
                                                    </option>
                                                    <option value="$500 – $1,000">
                                                        $500 – $1,000
                                                    </option>
                                                    <option value="$1,000 – $2,000">
                                                        $1,000 – $2,000
                                                    </option>
                                                    <option value="$2,000+">
                                                        $2,000+
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="catering-message"
                                                    style={{
                                                        display: "block",
                                                        fontFamily:
                                                            "var(--font-body)",
                                                        fontWeight: 600,
                                                        fontSize: 12,
                                                        letterSpacing: "0.06em",
                                                        color: "#003F58",
                                                        marginBottom: 6,
                                                    }}
                                                >
                                                    ANYTHING ELSE?
                                                </label>
                                                <textarea
                                                    id="catering-message"
                                                    rows={3}
                                                    maxLength={2000}
                                                    placeholder="Dietary requirements, event type, location..."
                                                    value={form.message}
                                                    onChange={(e) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            message:
                                                                e.target.value,
                                                        }))
                                                    }
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 14px",
                                                        borderRadius: 8,
                                                        border: "1.5px solid #ddd",
                                                        fontFamily:
                                                            "var(--font-body)",
                                                        fontSize: 15,
                                                        color: "#171717",
                                                        outline: "none",
                                                        resize: "vertical",
                                                    }}
                                                />
                                            </div>

                                            <div
                                                aria-hidden="true"
                                                style={{ position: "absolute", left: "-9999px" }}
                                            >
                                                <label htmlFor="catering-website">Website</label>
                                                <input
                                                    id="catering-website"
                                                    name="website"
                                                    type="text"
                                                    tabIndex={-1}
                                                    autoComplete="off"
                                                    value={website}
                                                    onChange={(e) => setWebsite(e.target.value)}
                                                />
                                            </div>

                                            {submitError && (
                                                <p
                                                    role="alert"
                                                    style={{
                                                        margin: 0,
                                                        color: "#8B1E1E",
                                                        fontFamily: "var(--font-body)",
                                                        fontSize: 13,
                                                        lineHeight: 1.5,
                                                    }}
                                                >
                                                    {submitError} <a href="tel:+61435337006">Call now</a>.
                                                </p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                style={{
                                                    backgroundColor: "#E07828",
                                                    color: "#FFFFFF",
                                                    fontFamily:
                                                        "var(--font-display)",
                                                    fontSize: 13,
                                                    letterSpacing: "0.06em",
                                                    padding: "14px 28px",
                                                    borderRadius: 8,
                                                    border: "none",
                                                    marginTop: 4,
                                                    transition:
                                                        "background-color 150ms ease",
                                                    opacity: submitting ? 0.7 : 1,
                                                    cursor: submitting ? "wait" : "pointer",
                                                }}
                                                onMouseEnter={(e) =>
                                                    (e.currentTarget.style.backgroundColor =
                                                        "#C4601A")
                                                }
                                                onMouseLeave={(e) =>
                                                    (e.currentTarget.style.backgroundColor =
                                                        "#E07828")
                                                }
                                            >
                                                {submitting ? "SENDING..." : "SEND ENQUIRY"}
                                            </button>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    textAlign: "center",
                                                    fontFamily:
                                                        "var(--font-body)",
                                                    fontSize: 12,
                                                    lineHeight: 1.5,
                                                    color: "#777",
                                                }}
                                            >
                                                Sends directly from this form — no email app needed.
                                            </p>
                                        </form>
                                    </>
                                )}
                            </DialogPopup>
                        </DialogPortal>
                    </DialogRoot>
                </div>

                {/* Right: Food image */}
                <div>
                    <img
                        src={cateringImage}
                        alt="Catering spread — Banh Mi platters and Vietnamese feast"
                        loading="lazy"
                        decoding="async"
                        width={1448}
                        height={1086}
                        style={{
                            width: "100%",
                            height: 480,
                            objectFit: "cover",
                            borderRadius: 12,
                            display: "block",
                            backgroundColor: "#C4601A",
                            boxShadow: "0 20px 60px rgba(0,63,88,0.2)",
                        }}
                    />
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) {
          .catering-section { padding: 64px 24px !important; }
          .catering-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </section>
    );
}

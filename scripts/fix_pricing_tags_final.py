with open('src/components/snepr/PricingSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add </ScrollCardReveal> after line 319's </Tilt3D>
target1 = """                <Link
                  to="/claim"
                  className="shimmer-hover flex h-12 w-full items-center justify-center rounded-2xl border border-[#E8E1D7] bg-[#FAF7F2] text-[14px] font-bold text-[#1B1410] transition-all hover:bg-[#F5EFEB] hover:border-[#8A4C24]"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </Tilt3D>"""

repl1 = """                <Link
                  to="/claim"
                  className="shimmer-hover flex h-12 w-full items-center justify-center rounded-2xl border border-[#E8E1D7] bg-[#FAF7F2] text-[14px] font-bold text-[#1B1410] transition-all hover:bg-[#F5EFEB] hover:border-[#8A4C24]"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </Tilt3D>
          </ScrollCardReveal>"""

text = text.replace(target1, repl1)

# 2. Remove extra </ScrollCardReveal> at line 433
target2 = """              </div>
            </div>
          </Tilt3D>
          </ScrollCardReveal>
        </div>

        {/* ??? PREDATORY APPS VS SNEPR COMPARISON TABLE ??? */}"""

repl2 = """              </div>
            </div>
          </Tilt3D>
        </div>

        {/* ??? PREDATORY APPS VS SNEPR COMPARISON TABLE ??? */}"""

text = text.replace(target2, repl2)

with open('src/components/snepr/PricingSection.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed JSX tags in PricingSection.tsx")

